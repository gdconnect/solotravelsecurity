/**
 * Cloudflare Durable Object: TripwireCoordinatorDO
 *
 * Stateful dead-man check-in coordinator at the edge.
 * Uses storage.setAlarm() for autonomous time-triggered escalations.
 * Sends alerts via SendGrid v3 API when check-ins are missed.
 */

export interface Env {
  SENDGRID_API_KEY?: string;
  SENDGRID_FROM_EMAIL?: string;
}

export interface StoredTripwireState {
  sessionId: string;
  contactEmail: string;
  destinationCity: string;
  dueTimestamp: number;
  gracePeriodMs: number;
  status: "ARMED" | "CHECKED_IN" | "TRIGGERED" | "DISARMED";
  encryptedPayload: string;
  createdAt: number;
}

export interface DurableObjectStorage {
  get<T = unknown>(key: string): Promise<T | undefined>;
  put<T = unknown>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<boolean>;
  deleteAll(): Promise<void>;
  setAlarm(scheduledTime: number | Date): Promise<void>;
  deleteAlarm(): Promise<void>;
  getAlarm(): Promise<number | null>;
}

export interface DurableObjectState {
  id: { toString(): string };
  storage: DurableObjectStorage;
  waitUntil(promise: Promise<unknown>): void;
}

export class TripwireCoordinatorDO {
  private ctx: DurableObjectState;
  private env: Env;

  constructor(ctx: DurableObjectState, env: Env) {
    this.ctx = ctx;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // POST /arm
    if (request.method === "POST" && url.pathname.endsWith("/arm")) {
      const body = (await request.json()) as {
        sessionId: string;
        contactEmail: string;
        destinationCity: string;
        dueTimestamp: number;
        gracePeriodMs?: number;
        encryptedPayload: string;
      };

      const gracePeriodMs = body.gracePeriodMs || 7200000; // 2 hours
      const state: StoredTripwireState = {
        sessionId: body.sessionId,
        contactEmail: body.contactEmail,
        destinationCity: body.destinationCity,
        dueTimestamp: body.dueTimestamp,
        gracePeriodMs,
        status: "ARMED",
        encryptedPayload: body.encryptedPayload,
        createdAt: Date.now(),
      };

      await this.ctx.storage.put("tripwire_state", state);

      // Set Cloudflare Durable Object Alarm
      const alarmTime = state.dueTimestamp + state.gracePeriodMs;
      await this.ctx.storage.setAlarm(alarmTime);

      return Response.json({
        success: true,
        message: "Tripwire armed",
        alarmScheduledFor: new Date(alarmTime).toISOString(),
      });
    }

    // POST /checkin
    if (request.method === "POST" && url.pathname.endsWith("/checkin")) {
      const state = await this.ctx.storage.get<StoredTripwireState>("tripwire_state");
      if (!state) {
        return new Response("Tripwire state not found", { status: 404 });
      }

      state.status = "CHECKED_IN";
      await this.ctx.storage.put("tripwire_state", state);
      await this.ctx.storage.deleteAlarm(); // Cancel pending dead-man alarm

      return Response.json({
        success: true,
        message: "Check-in pulse accepted. Alarm cleared.",
      });
    }

    // POST /disarm
    if (request.method === "POST" && url.pathname.endsWith("/disarm")) {
      await this.ctx.storage.deleteAll();
      await this.ctx.storage.deleteAlarm();
      return Response.json({ success: true, message: "Tripwire disarmed and destroyed." });
    }

    // GET /status
    if (request.method === "GET" && url.pathname.endsWith("/status")) {
      const state = await this.ctx.storage.get<StoredTripwireState>("tripwire_state");
      return Response.json(state || { status: "IDLE" });
    }

    return new Response("Not Found", { status: 404 });
  }

  /**
   * Dead-Man Alarm Trigger:
   * Autonomously invoked by the Cloudflare Workers runtime when the scheduled time arrives.
   */
  async alarm(): Promise<void> {
    const state = await this.ctx.storage.get<StoredTripwireState>("tripwire_state");
    if (!state || state.status !== "ARMED") {
      return;
    }

    // Mark as triggered
    state.status = "TRIGGERED";
    await this.ctx.storage.put("tripwire_state", state);

    // Dispatch escalation email via SendGrid
    if (this.env.SENDGRID_API_KEY && state.contactEmail) {
      const fromEmail = this.env.SENDGRID_FROM_EMAIL || "alerts@solotravelsecurity.com";

      const emailBody = {
        personalizations: [
          {
            to: [{ email: state.contactEmail }],
            subject: `[SOLO TRAVEL SECURITY ALERT] Check-In Missed: ${state.destinationCity}`,
          },
        ],
        from: { email: fromEmail, name: "Solo Travel Security Tripwire" },
        content: [
          {
            type: "text/html",
            value: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
                <h2 style="color: #991b1b; margin-top: 0;">Automated Tripwire Escalation</h2>
                <p>You are receiving this automated alert because you were designated as the emergency contact for a solo traveler in <strong>${state.destinationCity}</strong>.</p>
                <p>Their scheduled daily check-in was due at <strong>${new Date(state.dueTimestamp).toUTCString()}</strong> and their 2-hour grace period has now elapsed with zero signal.</p>
                
                <h3 style="color: #0f172a; margin-top: 20px;">Deterministic Escalation Ladder:</h3>
                <ol style="line-height: 1.6;">
                  <li><strong>Stage 1 (Phone check):</strong> Attempt to phone traveler directly via voice call / WhatsApp.</li>
                  <li><strong>Stage 2 (Local check):</strong> If unanswered, phone their accommodation reception desk to request a quiet physical room check.</li>
                  <li><strong>Stage 3 (Carrier / Airline):</strong> Check recent flight/transit status for delays.</li>
                </ol>

                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px dashed #94a3b8;">
                  <p style="margin: 0; font-size: 13px; color: #475569;">
                    <strong>Encrypted Payload ID:</strong> ${state.sessionId}<br/>
                    Open the shared emergency link provided by the traveler to view decrypted hotel numbers and policy records.
                  </p>
                </div>

                <p style="font-size: 11px; color: #64748b;">Solo Travel Security · Awareness, not paranoia. Calm operating system.</p>
              </div>
            `,
          },
        ],
      };

      try {
        await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailBody),
        });
      } catch (err) {
        console.error("SendGrid alert dispatch error:", err);
      }
    }
  }
}
