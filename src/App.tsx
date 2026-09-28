import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function App(){

  const [data, setData] = useState([
    { question: 'Каковы фундаментальные ограничения этой задачи? Отдели стереотипы от ограничений.', answer: ''},
    { question: 'Первые принципы: какие базовые факты останутся, если убрать чужие мнения?', answer: ''},
    { question: 'Единицы измерения: в каких строгих метриках оценивается успех? Переведи проблему из плоскости чувств в физические величины. ', answer: ''},
    { question: 'Сферический конь в вакууме: как выглядит самое простое, пусть даже топорное решение в идеальных условиях?', answer: ''},
    { question: 'Пренебрежение малыми величинами: какими деталями можно пожертвовать на первом этапе?', answer: ''},
    { question: 'Поведение на бесконечности: что произойдет с твоим решением при экстремальной нагрузке?', answer: ''},
    { question: 'Изолированность системы: как решение выдержит падение внешней среды?', answer: ''},
    { question: 'Внутренняя интерференция: как две копии твоей системы уничтожат друг друга?', answer: ''},
    { question: 'Каковы паразитные затраты энергии на поддержание работы самой системы и не превышают ли они полезный эффект?', answer: ''},
    { question: 'Поиск аналога: на какую классическую задачу из «учебника» это похоже?', answer: ''}
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [textArea, setTextArea] = useState('')
  const [toShowResult, setToShowResult] = useState(false)

  const nextQuestion = () => {
      setData(data.map((item, index) => (
      index === currentIndex ? {...item, answer: textArea} : item   
    )))
    if (currentIndex === data.length-1) {
      setToShowResult(true) 
    } else {
    setTextArea('')
    setCurrentIndex(prev => prev + 1)
    }
  }

  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex, toShowResult])

  return (
    <div className='wrapper'>
      {toShowResult ? 

      <div className='container'>
        <button className='save-button' onClick={() => window.print()}>🖨️ Сохранить в PDF</button>
        <h1>Карта декомпозиции и стресс-теста задачи</h1>
        <ol>{data.map((item, index) => 
          <li key={index}>
            <h4>
              {item.question}
            </h4>
            <p className='report'>
              {item.answer}
            </p>
          </li>)}
        </ol>
      </div>
      : 
      <div className='container'>
        <h2>
          {currentIndex + 1}. {data[currentIndex].question}
        </h2>
        <textarea 
          ref={inputRef}
          className='textarea' 
          onChange={(e) => setTextArea(e.target.value)}
          value={textArea}
        >
        </textarea>
        <button 
          className='no-print'  
          onClick = {() => nextQuestion()}>{currentIndex === data.length-1 ? 'Завершить' : 'Далее'}
        </button>
      </div>
      }
    </div>
  )
}