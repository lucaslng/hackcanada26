// i18n.ts

export type Language = "en" | "fr";

export const UI = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      information: "Information",
      contact: "Contact Us",
      support: "Help / Support",
    },
    heroEyebrow: "Service Ontario Digital Pre-Service",
    heroTitle: "Renew Government Documents Faster",
    heroBody:
      "Verify your identity and upload required documents before visiting ServiceOntario to reduce wait times and complete renewals faster.",
    startService: "Start Service",
    learnMore: "Learn More",
    supportedServices: "Supported Services",
    supportedServicesBody: "Choose a service to begin secure onboarding.",
    comingSoon: "Coming Soon",
    howItWorks: "How It Works",
    howItWorksBody:
      "A simple and secure process designed for faster in-person service.",
    uploadDocuments: "Upload Documents",
    uploadDocumentsBody: "Submit required files online before your visit.",
    verifyIdentity: "Verify Identity",
    verifyIdentityBody: "Use ID and selfie comparison to confirm identity.",
    skipLine: "Skip the Line",
    skipLineBody: "Arrive prepared and complete renewal with less delay.",
    securityPrivacy: "Security & Privacy",
    securityPrivacyBody:
      "Your information is processed under strict security controls aligned with government digital service practices.",
    secureUploads: "Secure Uploads",
    secureUploadsBody: "Document uploads are protected in transit and at rest.",
    identityVerification: "Identity Verification",
    identityVerificationBody:
      "ID matching checks confirm the person submitting records.",
    encryptedProcessing: "Encrypted Processing",
    encryptedProcessingBody:
      "Sensitive data is handled in encrypted workflows.",
    contactUs: "Contact Us",
    contactUsBody: "Service support is available Monday to Friday.",
    helpSupport: "Help / Support",
    helpSupportBody:
      "Accessibility and assisted service options are available on request.",
    help1: "Accessible service formats and alternate verification paths",
    help2: "Technical support for upload or verification issues",
    help3: "Assisted phone support for incomplete submissions",
    phone: "Phone",
    email: "Email",
    hours: "Hours",
    // Step 1
    step1Title: "Step 1: Renewal Requirements",
    step1Subtitle: "Review requirements for your selected service.",
    selectedService: "Service selected",
    selfieRequirement: "Live selfie for identity verification",
    // Step 2 — Contact
    step2Title: "Step 2: Contact Information",
    step2Subtitle: "Provide your contact details before identity verification.",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    streetAddress: "Street Address",
    apartmentUnit: "Apartment / Unit (optional)",
    city: "City",
    province: "Province",
    postalCode: "Postal Code",
    selectProvince: "Select province or territory",
    contactInfoNotice:
      "Your contact information will only be used for processing your service request.",
    emailHelper: "Used to send updates about your application.",
    phoneHelper: "Used if additional verification is required.",
    invalidEmail: "Enter a valid email address.",
    invalidPhone: "Enter a valid 10-digit Canadian phone number.",
    invalidPostal: "Enter a valid Canadian postal code (A1A 1A1).",
    // Step 3
    step3Title: "Step 3: Upload ID Document",
    step3Subtitle: "Upload a clear image of your government-issued ID.",
    uploadIdBtn: "Upload ID Document",
    uploadIdSuccess: "ID upload completed successfully.",
    // Step 4
    step4Title: "Step 4: Verify Identity with Selfie",
    step4Subtitle: "Capture a live photo for identity verification.",
    uploadSelfieBtn: "Capture Selfie",
    uploadSelfieSuccess: "Selfie captured successfully.",
    // Step 5
    step5Title: "Step 5: Identity Comparison",
    step5Subtitle: "Run a secure comparison of ID and selfie photos.",
    runVerification: "Run Verification",
    verified: "Verified",
    notVerified: "Not verified",
    // Step 6
    noFormsAvailable: "No forms available for this service.",
    formGovNotice:
      "All forms link directly to official Government of Canada or ServiceOntario websites. Open PDF forms in a desktop browser.",
    mapFormsToggle:
      "Not sure which forms you need? Auto-map from a description",
    mappedFormsHeading: "Suggested forms based on your description:",
    mapFormsHint: 'Press "Map Request" to find matching forms.',
    step6Title: "Step 6: Forms to Print and Sign",
    step6Subtitle: "Review and fill in forms.",
    mapFormsLabel: "Type your request to map forms",
    mapFormsPlaceholder: "Example: renew driver's licence",
    mapRequestBtn: "Map Request",
    // Step 7
    step7Title: "Step 7: Submission",
    step7Subtitle: "Submission remains disabled in this demonstration.",
    submissionNotice:
      "Submission is currently unavailable. Backend handoff will be enabled in a later release.",
    // Step 8
    step8Title: "Step 8: Notifications",
    step8Subtitle: "Choose where updates should be sent.",
    savePreference: "Save Preference",
    updatesSent: "Updates will be sent via",
    emailLabel: "Email",
    smsLabel: "SMS",
    to: "to",
    // Nav
    back: "Previous",
    continue: "Continue",
    exitSetup: "Exit",
    returnHome: "Return Home",
    stepOf: "Step",
    of: "of",
  },
  fr: {
    nav: {
      home: "Accueil",
      services: "Services",
      information: "Information",
      contact: "Contact",
      support: "Aide",
    },
    heroEyebrow: "Préservice numérique ServiceOntario",
    heroTitle: "Renouvelez vos documents gouvernementaux plus rapidement",
    heroBody:
      "Vérifiez votre identité et téléversez vos documents avant votre visite à ServiceOntario afin de réduire l\u2019attente.",
    startService: "Commencer",
    learnMore: "En savoir plus",
    supportedServices: "Services offerts",
    supportedServicesBody:
      "Choisissez un service pour commencer l\u2019inscription sécurisée.",
    comingSoon: "Bientôt disponible",
    howItWorks: "Fonctionnement",
    howItWorksBody:
      "Un processus simple et sécuritaire pour accélérer le service en personne.",
    uploadDocuments: "Téléverser les documents",
    uploadDocumentsBody: "Soumettez les fichiers requis avant votre visite.",
    verifyIdentity: "Vérifier l\u2019identité",
    verifyIdentityBody:
      "Comparez la photo d\u2019identité et le selfie pour confirmer votre identité.",
    skipLine: "Réduire l\u2019attente",
    skipLineBody: "Arrivez préparé et terminez votre renouvellement plus vite.",
    securityPrivacy: "Sécurité et confidentialité",
    securityPrivacyBody:
      "Vos renseignements sont traités selon des contrôles de sécurité stricts conformes aux services numériques gouvernementaux.",
    secureUploads: "Téléversements sécurisés",
    secureUploadsBody: "Les documents sont protégés en transit et au repos.",
    identityVerification: "Vérification d'identité",
    identityVerificationBody:
      "Les contrôles de correspondance confirment la personne soumettant les documents.",
    encryptedProcessing: "Traitement chiffré",
    encryptedProcessingBody:
      "Les données sensibles sont traitées dans des flux chiffrés.",
    contactUs: "Contact",
    contactUsBody: "Le soutien est offert du lundi au vendredi.",
    helpSupport: "Aide",
    helpSupportBody:
      "Des options accessibles et de soutien assisté sont offertes sur demande.",
    help1: "Formats accessibles et parcours de vérification alternatifs",
    help2: "Soutien technique pour téléversement ou vérification",
    help3: "Aide téléphonique pour les soumissions incomplètes",
    phone: "Téléphone",
    email: "Courriel",
    hours: "Heures",
    // Step 1
    step1Title: "Étape 1 : Exigences de renouvellement",
    step1Subtitle: "Passez en revue les exigences pour le service choisi.",
    selectedService: "Service choisi",
    selfieRequirement: "Selfie en direct pour la vérification d\u2019identité",
    // Step 2 — Contact
    step2Title: "Étape 2 : Coordonnées",
    step2Subtitle: "Fournissez vos coordonnées avant la vérification.",
    fullName: "Nom complet",
    emailAddress: "Adresse courriel",
    phoneNumber: "Numéro de téléphone",
    streetAddress: "Adresse",
    apartmentUnit: "Appartement / Unité (optionnel)",
    city: "Ville",
    province: "Province",
    postalCode: "Code postal",
    selectProvince: "Choisir une province ou un territoire",
    contactInfoNotice:
      "Vos coordonnées seront utilisées uniquement pour le traitement de votre demande de service.",
    emailHelper: "Utilisé pour envoyer les mises à jour de votre demande.",
    phoneHelper: "Utilisé si une vérification supplémentaire est requise.",
    invalidEmail: "Saisissez une adresse courriel valide.",
    invalidPhone: "Saisissez un numéro canadien valide de 10 chiffres.",
    invalidPostal: "Saisissez un code postal canadien valide (A1A 1A1).",
    // Step 3
    step3Title: "Étape 3 : Téléverser la pièce d'identité",
    step3Subtitle:
      "Téléversez une image claire d'une pièce d'identité gouvernementale.",
    uploadIdBtn: "Téléverser la pièce d'identité",
    uploadIdSuccess: "Téléversement de la pièce réussi.",
    // Step 4
    step4Title: "Étape 4 : Vérifier l'identité avec un selfie",
    step4Subtitle: "Capturez une photo en direct pour la vérification.",
    uploadSelfieBtn: "Capturer le selfie",
    uploadSelfieSuccess: "Selfie capturé avec succès.",
    // Step 5
    step5Title: "Étape 5 : Comparaison d'identité",
    step5Subtitle: "Lancez une comparaison sécurisée des photos.",
    runVerification: "Lancer la vérification",
    verified: "Vérifié",
    notVerified: "Non vérifié",
    // Step 6
    noFormsAvailable: "Aucun formulaire disponible pour ce service.",
    formGovNotice:
      "Tous les formulaires renvoient directement aux sites officiels du gouvernement du Canada ou de ServiceOntario. Ouvrez les formulaires PDF avec un ordinateur de bureau.",
    mapFormsToggle:
      "Vous ne savez pas quels formulaires choisir ? Associez-les à partir d'une description",
    mappedFormsHeading: "Formulaires suggérés selon votre description :",
    mapFormsHint:
      "Appuyez sur « Associer la demande » pour trouver les formulaires correspondants.",
    step6Title: "Étape 6 : Formulaires à imprimer et signer",
    step6Subtitle:
      "Consultez les formulaires et associez-les à partir du texte saisi.",
    mapFormsLabel: "Saisissez votre demande pour associer les formulaires",
    mapFormsPlaceholder: "Exemple : renouveler le permis de conduire",
    mapRequestBtn: "Associer la demande",
    // Step 7
    step7Title: "Étape 7 : Soumission",
    step7Subtitle: "La soumission demeure désactivée dans cette démonstration.",
    submissionNotice:
      "La soumission est actuellement indisponible. Le transfert au backend sera activé ultérieurement.",
    // Step 8
    step8Title: "Étape 8 : Notifications",
    step8Subtitle: "Choisissez où recevoir les mises à jour.",
    savePreference: "Enregistrer",
    updatesSent: "Les mises à jour seront envoyées par",
    emailLabel: "Courriel",
    smsLabel: "SMS",
    to: "à",
    // Nav
    back: "Précédent",
    continue: "Continuer",
    exitSetup: "Quitter la configuration",
    returnHome: "Retour à l'accueil",
    stepOf: "Étape",
    of: "sur",
  },
} as const;

// Widened to string so both EN and FR literals satisfy the type.
// Using typeof UI['en'] would lock every property to its English literal value.
export type UIStrings = {
  [K in keyof (typeof UI)["en"]]: (typeof UI)["en"][K] extends Record<
    string,
    string
  >
    ? Record<string, string>
    : string;
};

export const SERVICE_TEXT: Record<
  string,
  {
    en: { title: string; description: string };
    fr: { title: string; description: string };
  }
> = {
  passport: {
    en: {
      title: "Passport Renewal",
      description: "Renew an adult or child Canadian passport.",
    },
    fr: {
      title: "Renouvellement de passeport",
      description: "Renouvelez un passeport canadien adulte ou enfant.",
    },
  },
  "drivers-license": {
    en: {
      title: "Driver's Licence Renewal",
      description: "Renew an expiring driver's licence.",
    },
    fr: {
      title: "Renouvellement du permis de conduire",
      description: "Renouvelez un permis de conduire expirant.",
    },
  },
  "health-card": {
    en: {
      title: "Health Card Renewal",
      description: "Renew your provincial health card coverage.",
    },
    fr: {
      title: "Renouvellement de la carte santé",
      description: "Renouvelez votre couverture de carte santé provinciale.",
    },
  },
  sin: {
    en: {
      title: "SIN Record Update / Renewal",
      description: "Update or renew SIN records for eligibility checks.",
    },
    fr: {
      title: "Mise à jour / renouvellement du NAS",
      description: "Mettez à jour ou renouvelez les dossiers du NAS.",
    },
  },
  "address-change": {
    en: {
      title: "Address Change",
      description:
        "Update your address on government records and service files.",
    },
    fr: {
      title: "Changement d'adresse",
      description:
        "Mettez à jour votre adresse dans les dossiers gouvernementaux.",
    },
  },
  "birth-certificate": {
    en: {
      title: "Birth Certificate",
      description: "Request a new birth certificate or replacement copy.",
    },
    fr: {
      title: "Certificat de naissance",
      description:
        "Demandez un nouveau certificat de naissance ou un remplacement.",
    },
  },
  "pr-card": {
    en: {
      title: "PR Card",
      description: "Renew or replace your permanent resident card.",
    },
    fr: {
      title: "Carte RP",
      description: "Renouvelez ou remplacez votre carte de résident permanent.",
    },
  },
  "name-change": {
    en: {
      title: "Name Change",
      description: "Submit forms for legal name change records.",
    },
    fr: {
      title: "Changement de nom",
      description: "Soumettez les formulaires pour un changement de nom légal.",
    },
  },
};
