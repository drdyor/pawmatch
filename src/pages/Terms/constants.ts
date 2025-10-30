export interface User {
  id: string
  username: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // For allowing other string key properties
  locationId?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    whatsapp?: string
    telegram?: string
  }
}

export const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  username: '',
  image: '',
  email: '',
  description: '',
  deleteFiles: '',
  role: '',
  locationId: '',
  socialMedia: {},
}

export const markdownFR = `# 🌟 Conditions Générales - Pet's Love 🌟

_Dernière mise à jour : 29-09-2021_  

Bienvenue sur **Pet's Love** ! 🐾 Ces conditions générales décrivent les règles et réglementations pour l'utilisation de l'application Pet's Love (ci-après dénommée "l'App" ou "le Service"). En accédant à ou en utilisant l'App, vous acceptez de respecter et d'être lié par les conditions suivantes. Si vous n'acceptez pas une partie de ces conditions, veuillez ne pas utiliser notre App.

## 1. Acceptation des Conditions

En créant un compte ou en accédant à l'App, vous acceptez et vous vous engagez à respecter ces Conditions Générales ainsi que notre Politique de Confidentialité. Si vous n'êtes pas d'accord avec ces conditions, vous ne devez pas utiliser l'App.

## 2. Comptes d'Utilisateur

- **Éligibilité** : Vous devez avoir au moins 18 ans pour utiliser l'App. En vous inscrivant pour un compte, vous déclarez que vous remplissez cette exigence d'âge. ❤️
- **Sécurité du Compte** : Vous êtes responsable de maintenir la confidentialité de vos identifiants de compte. Vous acceptez de nous informer immédiatement si vous soupçonnez un accès non autorisé à votre compte.
- **Informations du Compte** : Vous devez fournir des informations exactes et complètes lors de la création de votre compte. Vous êtes responsable de la mise à jour de vos informations si elles changent. 📝

## 3. Utilisation de l'App

- **Usage Personnel** : L'App est destinée uniquement à un usage personnel et non commercial. Vous ne pouvez pas utiliser l'App à des fins commerciales sans notre consentement écrit exprès. 
- **Activités Interdites** : Les utilisateurs s'engagent à ne pas participer à l'une des activités suivantes :
  - Violation de toute loi ou réglementation locale, étatique, nationale ou internationale.
  - Publication ou transmission de tout matériel frauduleux, trompeur, diffamatoire, obscène ou autrement répréhensible.
  - Utilisation de l'App pour distribuer des spams ou des messages non sollicités.
  - Tentative d'interférer avec la sécurité ou la fonctionnalité de l'App.
  - Usurpation de l'identité d'une personne ou d'une entité ou fausse représentation de votre affiliation avec une personne ou une entité. 🚫

## 4. Contenu et Propriété Intellectuelle

- **Contenu Généré par l'Utilisateur** : En soumettant du contenu (par exemple, texte, photos) à l'App, vous accordez à Pet's Love une licence non exclusive, libre de redevances, mondiale et transférable pour utiliser, reproduire, modifier, distribuer et afficher votre contenu en relation avec le Service. 📸
- **Contenu Interdit** : Les utilisateurs ne doivent pas soumettre de contenu illégal, nuisible, abusif ou autrement inapproprié. Pet's Love se réserve le droit de supprimer tout contenu qui viole ces conditions ou qui est autrement répréhensible.
- **Propriété Intellectuelle** : Tout le contenu, les marques déposées, les logos et autres droits de propriété intellectuelle sur l'App appartiennent à Pet's Love ou à ses concédants. Vous ne pouvez pas utiliser notre propriété intellectuelle sans une autorisation écrite préalable. 💡

## 5. Politique de Confidentialité

Votre utilisation de l'App est également régie par notre [Politique de Confidentialité](#), qui explique comment nous collectons, utilisons et protégeons vos informations personnelles. Veuillez consulter attentivement notre Politique de Confidentialité. 🔒

## 6. Résiliation

Pet's Love se réserve le droit de suspendre ou de résilier votre compte et l'accès à l'App à tout moment, sans préavis, pour quelque raison que ce soit, y compris mais sans s'y limiter les violations de ces Conditions Générales.

## 7. Limitation de Responsabilité

Dans toute la mesure permise par la loi, Pet's Love ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de toute perte de bénéfices ou de revenus, qu'ils soient encourus directement ou indirectement, ou de toute perte de données, d'utilisation, de bonne volonté ou d'autres pertes intangibles résultant de :
- Votre utilisation ou incapacité à utiliser l'App.
- Un accès non autorisé à ou une altération de vos transmissions ou données.
- Tout autre sujet relatif à l'App. 💔

## 8. Résolution des Litiges

Tout litige résultant de ou lié à ces Conditions Générales ou à l'utilisation de l'App sera résolu par arbitrage contraignant conformément aux règles de [l'Association d'Arbitrage] dans [Juridiction]. Chaque partie supportera ses propres coûts et dépenses. ⚖️

## 9. Droit Applicable

Ces Conditions Générales sont régies par et interprétées conformément aux lois de [Votre Pays/État], sans égard à ses principes de conflit de lois. 🌍

## 10. Modifications des Conditions Générales

Nous nous réservons le droit de mettre à jour ou de modifier ces Conditions Générales à tout moment. Toute modification sera effective immédiatement après la publication des conditions mises à jour dans l'App. Votre utilisation continue de l'App après de telles modifications constitue votre acceptation des nouvelles Conditions Générales. 🔄

## 11. Informations de Contact

Si vous avez des questions ou des préoccupations concernant ces Conditions Générales, veuillez nous contacter à alexrobainaph@gmail.com. 💌

---

Argentine, Mendoza`

export const markdownES = `# 🌟 Términos y Condiciones - Pet's Love 🌟

_Última Actualización: 29-09-2021_  

¡Bienvenido a **Pet's Love**! 🐾 Estos términos y condiciones describen las reglas y regulaciones para el uso de la App de Pet's Love (en adelante, "la App" o "el Servicio"). Al acceder o utilizar la App, aceptas cumplir y estar sujeto a los siguientes términos. Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices nuestra App.

## 1. Aceptación de Términos

Al crear una cuenta o acceder a la App, aceptas y te comprometes a cumplir con estos Términos y Condiciones y nuestra Política de Privacidad. Si no estás de acuerdo con estos términos, no debes utilizar la App.

## 2. Cuentas de Usuario

- **Elegibilidad**: Debes tener al menos 18 años de edad para usar la App. Al registrarte para una cuenta, declaras que cumples con este requisito de edad. ❤️
- **Seguridad de la Cuenta**: Eres responsable de mantener la confidencialidad de tus credenciales de cuenta. Aceptas notificarnos de inmediato si sospechas de un acceso no autorizado a tu cuenta.
- **Información de la Cuenta**: Debes proporcionar información precisa y completa al crear tu cuenta. Eres responsable de actualizar tu información si cambia. 📝

## 3. Uso de la App

- **Uso Personal**: La App está destinada únicamente para uso personal y no comercial. No puedes utilizar la App con fines comerciales sin nuestro consentimiento expreso por escrito. 
- **Actividades Prohibidas**: Los usuarios aceptan no participar en ninguna de las siguientes actividades:
  - Violar cualquier ley o reglamento local, estatal, nacional o internacional.
  - Publicar o transmitir cualquier material que sea fraudulento, engañoso, difamatorio, obsceno u objetable de otro modo.
  - Utilizar la App para distribuir spam o mensajes no solicitados.
  - Intentar interferir con la seguridad o funcionalidad de la App.
  - Hacerse pasar por cualquier persona o entidad o representar falsamente su afiliación con cualquier persona o entidad. 🚫

## 4. Contenido e Información de Propiedad Intelectual

- **Contenido Generado por el Usuario**: Al enviar contenido (por ejemplo, texto, fotos) a la App, otorgas a Pet's Love una licencia no exclusiva, libre de regalías, mundial y transferible para usar, reproducir, modificar, distribuir y mostrar tu contenido en relación con el Servicio. 📸
- **Contenido Prohibido**: Los usuarios no deben enviar ningún contenido que sea ilegal, dañino, abusivo o inapropiado de otro modo. Pet's Love se reserva el derecho de eliminar cualquier contenido que viole estos términos o que sea objetable de otro modo.
- **Propiedad Intelectual**: Todo el contenido, marcas registradas, logotipos y otros derechos de propiedad intelectual en la App son propiedad de Pet's Love o de sus licenciantes. No puedes utilizar ninguna de nuestras propiedades intelectuales sin previo permiso por escrito. 💡

## 5. Política de Privacidad

Tu uso de la App también está regido por nuestra [Política de Privacidad](#), que explica cómo recopilamos, usamos y protegemos tu información personal. Por favor, revisa nuestra Política de Privacidad cuidadosamente. 🔒

## 6. Terminación

Pet's Love se reserva el derecho de suspender o cancelar tu cuenta y el acceso a la App en cualquier momento, sin previo aviso, por cualquier motivo, incluyendo pero no limitado a violaciones de estos Términos y Condiciones.

## 7. Limitación de Responsabilidad

En la mayor medida permitida por la ley, Pet's Love no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, ni de ninguna pérdida de beneficios o ingresos, ya sea incurridos directa o indirectamente, o cualquier pérdida de datos, uso, buena voluntad u otras pérdidas intangibles, que resulten de:
- Tu uso o imposibilidad de uso de la App.
- Acceso no autorizado a o alteración de tus transmisiones o datos.
- Cualquier otro asunto relacionado con la App. 💔

## 8. Resolución de Disputas

Cualquier disputa que surja de o esté relacionada con estos Términos y Condiciones o el uso de la App será resuelta mediante arbitraje vinculante de acuerdo con las reglas de la [Asociación de Arbitraje] en [Jurisdicción]. Cada parte asumirá sus propios costos y gastos. ⚖️

## 9. Ley Aplicable

Estos Términos y Condiciones se rigen por y se interpretan de acuerdo con las leyes de [Tu País/Estado], sin tener en cuenta sus principios de conflicto de leyes. 🌍

## 10. Cambios en los Términos y Condiciones

Nos reservamos el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento. Cualquier cambio será efectivo inmediatamente al publicar los términos actualizados en la App. Tu uso continuo de la App después de dichos cambios constituye tu aceptación de los nuevos Términos y Condiciones. 🔄

## 11. Información de Contacto

Si tienes alguna pregunta o inquietud acerca de estos Términos y Condiciones, por favor contáctanos en alexrobainaph@gmail.com. 💌

---

Argentina, Mendoza

---

Let me know if you need any further assistance!
  `

export const markdownEN = `# 🌟 Terms & Conditions - Pet's Love 🌟

_Last Updated: 29-09-2021_  

Welcome to **Pet's Love**! 🐾 These terms and conditions outline the rules and regulations for using the Pet's Love App (hereafter referred to as "the App" or "the Service"). By accessing or using the App, you agree to comply with and be bound by the following terms. If you disagree with any part of these terms, please do not use our App.

## 1. Acceptance of Terms

By creating an account or accessing the App, you accept and agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree with these terms, you should not use the App.

## 2. User Accounts

- **Eligibility**: You must be at least 18 years old to use the App. By registering for an account, you represent that you meet this age requirement. ❤️
- **Account Security**: You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately if you suspect unauthorized access to your account.
- **Account Information**: You must provide accurate and complete information when creating your account. You are responsible for updating your information if it changes. 📝

## 3. Use of the App

- **Personal Use**: The App is intended for personal, non-commercial use only. You may not use the App for any commercial purpose without our express written consent. 
- **Prohibited Activities**: Users agree not to engage in any of the following activities:
  - Violating any local, state, national, or international law or regulation.
  - Posting or transmitting any material that is fraudulent, misleading, defamatory, obscene, or otherwise objectionable.
  - Using the App to distribute spam or unsolicited messages.
  - Attempting to interfere with the security or functionality of the App.
  - Impersonating any person or entity or falsely representing your affiliation with any person or entity. 🚫

## 4. Content and Intellectual Property

- **User-Generated Content**: By submitting content (e.g., text, photos) to the App, you grant Pet's Love a non-exclusive, royalty-free, worldwide, and transferable license to use, reproduce, modify, distribute, and display your content in connection with the Service. 📸
- **Prohibited Content**: Users must not submit any content that is illegal, harmful, abusive, or otherwise inappropriate. Pet's Love reserves the right to remove any content that violates these terms or is otherwise objectionable.
- **Intellectual Property**: All content, trademarks, logos, and other intellectual property rights in the App are owned by Pet's Love or its licensors. You may not use any of our intellectual property without prior written permission. 💡

## 5. Privacy Policy

Your use of the App is also governed by our [Privacy Policy](#), which explains how we collect, use, and protect your personal information. Please review our Privacy Policy carefully. 🔒

## 6. Termination

Pet's Love reserves the right to suspend or terminate your account and access to the App at any time, without notice, for any reason, including but not limited to violations of these Terms & Conditions. 

## 7. Limitation of Liability

To the fullest extent permitted by law, Pet's Love shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
- Your use of or inability to use the App.
- Unauthorized access to or alteration of your transmissions or data.
- Any other matter relating to the App. 💔


## 8. Dispute Resolution

Any disputes arising out of or relating to these Terms & Conditions or the use of the App shall be resolved through binding arbitration in accordance with the rules of the [Arbitration Association] in [Jurisdiction]. Each party shall bear its own costs and expenses. ⚖️

## 9. Governing Law

These Terms & Conditions are governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles. 🌍

## 10. Changes to Terms & Conditions

We reserve the right to update or modify these Terms & Conditions at any time. Any changes will be effective immediately upon posting the updated terms in the App. Your continued use of the App after such changes constitutes your acceptance of the new Terms & Conditions. 🔄

## 11. Contact Information

If you have any questions or concerns about these Terms & Conditions, please contact us at alexrobainaph@gmail.com. 💌

---

Argentina, Mendoza

  `
