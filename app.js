// Get references to HTML elements with the specified IDs
const game = document.getElementById('game')
const scoreDisplay1 = document.getElementById('scoreDisplay1')
const scoreDisplay2 = document.getElementById('scoreDisplay2')

// Establish variables for game
let score1 = 0
let score2 = 0
let currentPlayer = 1
let roundsPlayed = 0
const maxRounds = 1

// Define an array of categories for the trivia game - each category has a name and ID from the API database
const categories  = [
    {
        name: 'General Knowledge',
        id: 9
    },
    {
        name: 'Film',
        id: 11
    },
    {
        name: 'Music',
        id: 12
    },
    {
        name: 'Television',
        id: 14
    },
    {
        name: 'Celebrities',
        id: 26
    }
]

// Define the levels of difficulty per question within the category. 
const levels = ['easy', 'medium', 'hard']

// Define a function to handle flipping a card upon clicking
const flipCard = (event) => {
    // Get the card that was clicked
    const card = event.currentTarget
    // Clear the contents of the card
    card.innerHTML = ''
    // Create elements for the card's text, true button and false button
    const textBox = document.createElement('div')
    const trueButton = document.createElement('button')
    const falseButton = document.createElement('button')
    // Set styles for the text
    textBox.style.fontSize = '15px'
    textBox.style.marginBottom = '10px'
    textBox.style.height = '100px'
    textBox.style.overflow = 'auto'
    
    // Set labels for true and false buttons
    trueButton.innerHTML = 'True'
    falseButton.innerHTML = 'False'
    // Add CSS classes to the true and false buttons
    trueButton.classList.add('true-button')
    falseButton.classList.add('false-button')
    // Add event listeners for the buttons
    trueButton.addEventListener('click', getResult)
    falseButton.addEventListener('click', getResult)
    // Get the question from the card's data attribute and display it
    textBox.innerHTML = card.getAttribute('data-question')
    
    // Append the text box and buttons to the card
    card.appendChild(textBox)
    card.appendChild(trueButton)
    card.appendChild(falseButton)

    // Disable click event listeners for all cards
    const allCards = Array.from(document.querySelectorAll('.card'))
    allCards.forEach(card => card.removeEventListener('click', flipCard))
}

// Define a function to address the result of the user's choice
function getResult() {
    // Enable click event listeners for all cards
    const allCards = Array.from(document.querySelectorAll('.card'))
    allCards.forEach(card => card.addEventListener('click', flipCard))
    // Get the parent element of the button that was clicked
    const cardOfButton = this.parentElement
    // Check if the chosen answer matches the correct answer
    if (cardOfButton.getAttribute('data-answer') === this.innerHTML) {
        // Update the player's score
        const value = parseInt(cardOfButton.getAttribute('data-value'))
        if (currentPlayer === 1) {
            score1 += value
            scoreDisplay1.innerHTML = '$' + score1
        } else {
            score2 += value
            scoreDisplay2.innerHTML = '$' + score2
        }
        // Add a CSS class for a correct answer and update the content of the card
        cardOfButton.classList.add('correct-answer')
        setTimeout (() => {
            while (cardOfButton.firstchild) {
              cardOfButton.removeChild(cardOfButton.firstChild)  
            }
            cardOfButton.innerHTML = cardOfButton.getAttribute('data-value')
        }, 1000)
    } else {
        // Add a CSS class for a wrong answer and update the content of the card
        cardOfButton.classList.add('wrong-answer')
        setTimeout (() => {
            while (cardOfButton.firstchild) {
              cardOfButton.removeChild(cardOfButton.firstChild) 
            } 
              cardOfButton.innerHTML = '$0'
            }, 1000)        
        }
        // Remove the click event listener from the current card
        cardOfButton.removeEventListener('click', flipCard)
        // Switch to the next player
        currentPlayer = currentPlayer === 1 ? 2 : 1

        // Check for the end of the game based on the rounds played
        if (roundsPlayed === maxRounds) {
        // Determine the winner based on the scores
        if (score1 > score2) {
            console.log('Player 1 wins!')
        } else if (score2 > score1) {
            console.log('Player 2 wins!')
        } else {
            console.log('It\'s a tie!')
        }
    } else {
        // Increment the rounds played
        roundsPlayed++
    }
    }   

// Define a function to add a category to the game
const addCategory = (category) => {
    // Create a column for the category
    const column = document.createElement('div')
    column.classList.add('category-column')
    // Set the category name as the content of the column
    column.innerHTML = category.name
    // Append the column to the game container
    game.append(column)

    
    // Style the category name
    column.style.font = 'Roboto'
    column.style.fontSize = '30px'
    column.style.fontWeight = 'bold'
    column.style.marginBottom = '10px'
    column.style.color = 'white'
    
    // Iterate through difficulty levels and create cards
    levels.forEach(level => {
        // Create a card
        const card = document.createElement('div')
        // Give the card a class
        card.classList.add('card')
        // putting the card into the column
        column.append(card)
        // Set the content of the card based on the difficulty level
        if(level === 'easy') {
            card.innerHTML = '$100'
        }

        if(level === 'medium') {
            card.innerHTML = '$200'
        }

        if(level === 'hard') {
            card.innerHTML = '$300'
        }
        // Fetch a trivia question using the Open Trivia Database API
        fetch(`https://opentdb.com/api.php?amount=1&category=${category.id}&difficulty=${level}&type=boolean`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // Set the question, answer, and value as data attributes on the card
                card.setAttribute('data-question', data.results[0].question)
                card.setAttribute('data-answer', data.results[0].correct_answer)
                card.setAttribute('data-value', card.innerHTML.replace('$', ''))
    })
            .then(done => card.addEventListener('click', flipCard))
        
})
    }


// Iterate through categories and add each category to the game
categories.forEach(classification => addCategory(classification))








