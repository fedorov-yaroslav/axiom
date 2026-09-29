import { useState, useRef, useEffect } from 'react'
import './App.css'

type ScreenType = 'start' | 'questions' | 'finish'

interface QuestionItem {
  question: string;
  answer: string
}

  const INITIAL_QUESTIONS: QuestionItem[] = [
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
  ]

  export default function App(){
  const [data, setData] = useState<QuestionItem[]>(() => 
    localStorage.getItem('questions-ls') 
      ? JSON.parse(localStorage.getItem('questions-ls')!) 
      : INITIAL_QUESTIONS
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [textArea, setTextArea] = useState('')
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('start')
  const [problem, setProblem] = useState<string>(() =>
    localStorage.getItem('problem-ls') || ''
  )

  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    localStorage.setItem('questions-ls', JSON.stringify(data))
    localStorage.setItem('problem-ls', problem)
    inputRef.current?.focus()
  }, [currentIndex, currentScreen, data])

  const progressPercentage = Math.round((currentIndex / data.length) * 100)

  const changeScreen = () => {
    if (currentScreen === 'start'){
      setCurrentScreen('questions')
    }
  }

  const nextQuestion = () => {
      setData(data.map((item, index) => (
      index === currentIndex ? {...item, answer: textArea} : item   
    )))
    if (currentIndex === data.length-1) {
      setCurrentScreen('finish') 
    } else {
      setTextArea('')
      setCurrentIndex(prev => prev + 1)
    }
  }

  return (
    <div className='wrapper'>
      
      {/* Screen 1. Start */}
      {currentScreen === 'start' && (
        <div className='container'>
          <h2>Опишите вашу задачу или проблему</h2>
          <textarea 
            className='textarea' 
            value={problem} 
            onChange={(e) => setProblem(e.target.value)}
          />
          <button 
            className='no-print' 
            disabled={!problem.trim()} 
            onClick={changeScreen}
          >
            Декомпозиция
          </button>
        </div>
      )}

      {/* Screen 2: Questions */}
      {currentScreen === 'questions' && (
        <div className='container'>
          <div className='progress-bar' style={{ width: `${progressPercentage}%` }}></div>
          <h2>
            {currentIndex + 1}. {data[currentIndex].question}
          </h2>
          <textarea 
            ref={inputRef}
            className='textarea' 
            onChange={(e) => setTextArea(e.target.value)}
            value={textArea}
            placeholder="Ваш ответ..."
          />
          <br />
          <button className='no-print' onClick={nextQuestion}>
            {currentIndex === data.length - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      )}

      {/* Screen 3: Finish */}
      {currentScreen === 'finish' && (
        <div className='container'>
          <button className='save-button no-print' onClick={() => window.print()}>🖨️ Сохранить в PDF</button>
          <h1>Карта декомпозиции и стресс-теста задачи</h1>
          {problem && <h3 className='problem-title'>Целевая проблема: {problem}</h3>}
          <ol>
            {data.map((item, index) => (
              <li key={index}>
                <h4>{item.question}</h4>
                <p className='report'>{item.answer}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

    </div>
  );
}