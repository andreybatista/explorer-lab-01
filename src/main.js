import "./css/index.css"
import IMask from 'imask';

const ccBgColor01 = document.querySelector(".cc-bg svg > g > g:nth-child(1) > path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g > g:nth-child(2) > path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) > img")


function setCardType(type) {
    
    const colors = {
        visa: ['#436D99', '#2D57F2'],
        masterCard: ['#DF6F29', '#C69347'],
        default: ['black', 'gray'],
    }

    ccBgColor01.setAttribute('fill', colors[type][0])
    ccBgColor02.setAttribute('fill', colors[type][1])
    ccLogo.setAttribute('src', `cc-${type}.svg`)
}


globalThis.setCardType = setCardType


var securityCode = document.querySelector('#security-code');
var securityCodePattern = {
    mask: '0000'
};
setCardType('default')
var securityCodeMasked = IMask(securityCode, securityCodePattern);



var expirationDate = document.querySelector('#expiration-date');
var expirationDatePattern = {
    mask: 'MM{/}YY',
    blocks: {

        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
    }
};
var expirationDateMasked = IMask(expirationDate, expirationDatePattern);

var cardNumber = document.querySelector('#card-number');
var cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: 'visa'
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: 'masterCard'
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: 'default'
        }
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');

        const foundMask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        });

        return foundMask
    }
};
var cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector('#add-card')

addButton.addEventListener('click', () => {
    alert('click')
})

document.querySelector("form").addEventListener('submit', (event) => {
    event.preventDefault()
})

const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value')

    ccHolder.innerHTML = cardHolder.value.length === 0 ? 'FULANO DA SILVA' : cardHolder.value
})

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = code.length === 0 ? "123" : code
}


cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number")

    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}


expirationDateMasked.on("accept", () => {
    updateExpirationDateM(expirationDateMasked.value)
})

function updateExpirationDateM(date) {
    const ccExpiration = document.querySelector(".cc-extra .value")

    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
