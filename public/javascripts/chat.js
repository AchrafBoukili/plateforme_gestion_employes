const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbot = document.querySelector('.chatbot');
const messagesContainer = document.querySelector('.chatbot-messages');
const inputField = document.querySelector('.chatbot-input input');
const sendBtn = document.querySelector('.send-btn');
    
    // Toggle chatbot
chatbotToggler.addEventListener('click', () => {
        chatbot.classList.toggle('active');
        chatbotToggler.classList.toggle('active');
    });
    
    // Fonction d'envoi de message
function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;
    
        // Ajouter message utilisateur
    addMessage(message, 'user');
    inputField.value = '';
        
        // Simuler réponse du bot
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addMessage(botResponse, 'bot');
        }, 1000);
    }
    
    // générer une réponse simple
function generateBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('bonjour')) {
            return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
        }
        
        if (lowerMessage.includes('employé') || lowerMessage.includes('ajouter')) {
            return "Pour ajouter un employé, cliquez sur le bouton 'Ajouter' dans la liste des employés.";
        }
        
        if (lowerMessage.includes('modifier') || lowerMessage.includes('éditer')) {
            return "Pour modifier un employé, sélectionnez-le dans la liste et cliquez sur 'Modifier'.";
        }
        
        if (lowerMessage.includes('supprimer')) {
            return "Pour supprimer un employé, sélectionnez-le et cliquez sur 'Supprimer'. Attention, cette action est irréversible.";
        }
        
        if (lowerMessage.includes('recherche') || lowerMessage.includes('chercher')) {
            return "Utilisez la barre de recherche en haut de la liste des employés pour filtrer les résultats.";
        }
        
        if (lowerMessage.includes('erreur')) {
            return "En cas d'erreur, veuillez rafraîchir la page. Si le problème persiste, contactez l'administrateur.";
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('administrateur')) {
            return "Vous pouvez contacter l'administrateur à l'adresse admin@entreprise.com ou cliquer sur le bouton 'Contact' du menu pour plus d'informations.";
        }
        
        if (lowerMessage.includes('aide')) {
            return "Je peux vous aider avec :\n- L'ajout/modification d'employés\n- La suppression\n- La recherche\n- Les problèmes techniques\nDites-moi ce dont vous avez besoin !";
        }
        
        if (lowerMessage.includes('problème')) {
            return "Veuillez contacter l'administrateur pour signaler ce problème.";
        }
        
        return "Je suis désolé, je n'ai pas compris. Pour plus d'aide, contactez l'administrateur.";
    }
    
    // Ajouter un message au chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Événements
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // message d'accueil initial
    setTimeout(() => {
        addMessage("Bonjour ! Je suis votre assistant virtuel. Posez-moi vos questions sur cette application de gestion d'employé.", 'bot');
    }, 2000);

    
    let isFirstMessage = true; // Pour éviter la duplication du premier message, ignorer cette variable

function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    // Ajouter message utilisateur
    addMessage(message, 'user');
    inputField.value = '';

    // Créer et positionner l'indicateur de frappe
    const typingIndicator = createTypingIndicator();
    messagesContainer.appendChild(typingIndicator);
    
    // Activer l'animation après un délai minimal
    setTimeout(() => typingIndicator.classList.add('active'), 50);

    // Simuler réponse après 3 secondes
    setTimeout(() => {
        typingIndicator.remove();
        const botResponse = generateBotResponse(message);
        addMessage(botResponse, 'bot');
    }, 3000);
}

function createTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    return div;
}
