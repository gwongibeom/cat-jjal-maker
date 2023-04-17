import './App.css'
import Title from './components/Title.js'
import React from 'react'

const jsonLocalStorage = {
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    },
    getItem: (key) => {
        return JSON.parse(localStorage.getItem(key))
    },
}

const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = 'https://cataas.com'
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`)
    const responseJson = await response.json()
    return `${OPEN_API_DOMAIN}/${responseJson.url}`
}

const Form = ({ updateMainCat }) => {
    const [value, setvalue] = React.useState('')
    const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text)
    const [errorMessage, setErrorMessage] = React.useState('')

    function handleInputChange(e) {
        const userValue = e.target.value
        setErrorMessage('')
        if (includesHangul(userValue)) {
            setErrorMessage('한글이 포함되어 있습니다.')
        }
        setvalue(userValue.toUpperCase())
    }

    function handleFormSubmit(e) {
        e.preventDefault()
        setErrorMessage('')
        if (value === '') {
            setErrorMessage('비어 있습니다.')
            return
        }
        updateMainCat(value)
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <input
                type='text'
                name='name'
                placeholder='영어 대사를 입력해주세요'
                onChange={handleInputChange}
                value={value}
            />
            <button type='submit'>생성</button>
            <p style={{ color: 'red' }}>{errorMessage}</p>
        </form>
    )
}

function CatItem({ img }) {
    return (
        <li>
            <img
                src={img}
                style={{
                    width: '150px',
                }}
            />
        </li>
    )
}

function Favorites({ favorites }) {
    if (favorites.length === 0) {
        return <div>사진 위 ❤를 눌러 사진을 저장해봐요!!!</div>
    }
    return (
        <ul className='favorites'>
            {favorites.map((cat) => (
                <CatItem img={cat} key={cat} />
            ))}
        </ul>
    )
}

const Maincard = (props) => {
    const heartIcon = props.isHeartedCatInArray ? '💖' : '🤍'
    return (
        <div className='main-card'>
            <img src={props.img} alt='고양이' width='400' />
            <button onClick={props.onHeartClick}>{heartIcon}</button>
        </div>
    )
}

const App = () => {
    const CAT1 = 'https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react'
    const CAT2 = 'https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn'
    const CAT3 = 'https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript'

    const [counter, setCounter] = React.useState(() => {
        return jsonLocalStorage.getItem('counter')
    })
    const [mainCat, setMaincat] = React.useState(CAT1)
    const [favorites, setFavorites] = React.useState(() => {
        return jsonLocalStorage.getItem('favorites') || []
    })

    async function setInitialCat() {
        const newCat = await fetchCat('First cat')
        setMaincat(newCat)
    }

    React.useEffect(() => {
        setInitialCat()
    }, [])

    const isHeartedCatInArray = favorites.includes(mainCat)

    async function updateMainCat(value) {
        const newCat = await fetchCat(value)
        setMaincat(newCat)

        setCounter((prev) => {
            const nextCounter = prev + 1
            jsonLocalStorage.setItem('counter', nextCounter)
            return nextCounter
        })
    }

    function handleHeartClick() {
        const nextFavorites = [...favorites, mainCat]
        setFavorites(nextFavorites)
        jsonLocalStorage.setItem('favorites', nextFavorites)
    }

    const counterTitle = counter === null ? '' : counter + '번째 '

    return (
        <div className='app'>
            <Title>{counterTitle}고양이 가라사대</Title>
            <Form updateMainCat={updateMainCat} />
            <Maincard
                img={mainCat}
                onHeartClick={handleHeartClick}
                isHeartedCatInArray={isHeartedCatInArray}
            />
            <Favorites favorites={favorites} />
        </div>
    )
}

export default App
