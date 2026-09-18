/**
 * Emergency Medical & Dietary Translation Dictionary for Solo Travelers.
 *
 * Provides accurate, life-critical emergency phrases translated and phonetically transcribed
 * for display on offline phone screens or printed cutout cards.
 */

export interface TranslatedMedicalStatement {
  english: string;
  translated: string;
  phonetic: string;
  language: string;
}

const DICTIONARY: Record<
  string, // language name lowercase
  Record<
    string, // condition key
    { translated: string; phonetic: string }
  >
> = {
  japanese: {
    penicillin_allergy: {
      translated: "ペニシリンアレルギーがあります。ペニシリン系抗生物質を投与しないでください。",
      phonetic:
        "Penishirin arerugii ga arimasu. Penishirin-kei kooseibusshitsu o tooyo shinaide kudasai.",
    },
    shellfish_allergy: {
      translated: "甲殻類（エビ・カニ）アレルギーがあります。微量でも食べられません。",
      phonetic: "Kookakurui (ebi, kani) arerugii ga arimasu. Biryoo demo taberaremasen.",
    },
    asthma: {
      translated: "喘息（ぜんそく）の発作です。吸入器（インヘラー）が必要です。",
      phonetic: "Zensoku no hossa desu. Kyuunyuuki ga hitsuyoo desu.",
    },
    epipen: {
      translated: "アナフィラキシーです！私のバッグにあるエピペンを打ってください！",
      phonetic: "Anafirakishii desu! Watashi no baggu ni aru Epipen o utte kudasai!",
    },
    emergency_doctor: {
      translated: "至急、救急車と英語が話せる医師を呼んでください！",
      phonetic: "Shikyuu, kyuukyuusha to eigo ga hanaseru ishi o yonde kudasai!",
    },
    blood_type_a_pos: {
      translated: "私の血液型はA型（Rh+）です。",
      phonetic: "Watashi no ketsuekigata wa ee-gata (aaru-eichi purasu) desu.",
    },
  },
  spanish: {
    penicillin_allergy: {
      translated: "Tengo alergia severa a la penicilina. No me administren antibióticos derivados.",
      phonetic: "TEN-go ah-LEHR-hee-ah seh-VEH-rah ah lah peh-nee-see-LEE-nah.",
    },
    shellfish_allergy: {
      translated: "Tengo alergia mortal a los mariscos y crustáceos. Ni siquiera trazas.",
      phonetic: "TEN-go ah-LEHR-hee-ah mor-TAHL ah lohs mah-REES-kohs.",
    },
    asthma: {
      translated: "Estoy teniendo un ataque de asma severo. Necesito mi inhalador de emergencia.",
      phonetic: "ehs-TOY teh-NYEHN-doh oon ah-TAH-keh deh AHS-mah.",
    },
    epipen: {
      translated: "¡Choque anafiláctico! Inyéctenme el EpiPen que está en mi mochila.",
      phonetic: "CHOH-keh ah-nah-fee-LAHK-tee-koh! een-YEHK-tehn-meh ehl eh-pee-pehn.",
    },
    emergency_doctor: {
      translated: "¡Por favor llame una ambulancia y a la policía turística de inmediato!",
      phonetic: "Por fah-VOR YAH-meh oo-nah ahm-boo-LAHN-syah.",
    },
    blood_type_a_pos: {
      translated: "Mi grupo sanguíneo es A positivo (A+).",
      phonetic: "Mee GROO-poh sahn-GEE-neh-oh ehs AH poh-see-TEE-voh.",
    },
  },
  french: {
    penicillin_allergy: {
      translated:
        "Je suis allergique à la pénicilline. Ne pas administrer d'antibiotiques dérivés.",
      phonetic: "Zhuh swee ah-lair-zheek ah lah pay-nee-see-leen.",
    },
    shellfish_allergy: {
      translated: "Allergie grave aux crustacés et fruits de mer. Même en infime quantité.",
      phonetic: "Ah-lair-zhee grahv oh kroos-tah-say.",
    },
    asthma: {
      translated: "Crise d'asthme sévère. J'ai besoin de mon inhalateur d'urgence.",
      phonetic: "Kreez dahsm say-vair.",
    },
    epipen: {
      translated: "Choc anaphylactique ! Utilisez l'auto-injecteur EpiPen dans mon sac.",
      phonetic: "Shohk ah-nah-fee-lahk-teek! Oo-tee-lee-zay leh-pee-pehn.",
    },
    emergency_doctor: {
      translated: "Appelez une ambulance (SAMU) immédiatement s'il vous plaît !",
      phonetic: "Ah-peh-lay oon ahm-boo-lahns.",
    },
    blood_type_a_pos: {
      translated: "Mon groupe sanguin est A positif (A+).",
      phonetic: "Mohn groop sahn-gahn ay Ah poh-zee-teef.",
    },
  },
};

/**
 * Retrieves translated medical alert cards for a destination language.
 */
export function getMedicalTranslations(language: string): TranslatedMedicalStatement[] {
  const langKey = language.toLowerCase();
  const langDict = DICTIONARY[langKey] || DICTIONARY.spanish; // Fallback to Spanish

  return [
    {
      english: "Severe Penicillin Allergy - Do not administer",
      translated: langDict.penicillin_allergy?.translated || "Penicillin allergy",
      phonetic: langDict.penicillin_allergy?.phonetic || "",
      language,
    },
    {
      english: "Severe Shellfish / Crustacean Allergy",
      translated: langDict.shellfish_allergy?.translated || "Shellfish allergy",
      phonetic: langDict.shellfish_allergy?.phonetic || "",
      language,
    },
    {
      english: "Emergency: Anaphylactic Shock - Use EpiPen in bag",
      translated: langDict.epipen?.translated || "Use EpiPen in bag",
      phonetic: langDict.epipen?.phonetic || "",
      language,
    },
    {
      english: "Blood Type: A-Positive (A+)",
      translated: langDict.blood_type_a_pos?.translated || "Blood Group A+",
      phonetic: langDict.blood_type_a_pos?.phonetic || "",
      language,
    },
  ];
}
