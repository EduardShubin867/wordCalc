import { useState, useEffect, useCallback } from 'react'

import { format, addDays } from 'date-fns'
import { ru } from 'date-fns/locale'

const WordCount = () => {
    const [totalWords, setTotalWords] = useState<number | null>(null)
    const [targetDate, setTargetDate] = useState<string>('')
    const [formattedTotalWords, setFormattedTotalWords] = useState<string>('')
    const [wordsPerDay, setWordsPerDay] = useState<number | null>(null)
    const [slowerCompletionDate, setSlowerCompletionDate] =
        useState<Date | null>(null)
    const [fasterCompletionDate, setFasterCompletionDate] =
        useState<Date | null>(null)
    const [slowerWordsPerDay, setSlowerWordsPerDay] = useState<number | null>(
        null
    )
    const [fasterWordsPerDay, setFasterWordsPerDay] = useState<number | null>(
        null
    )

    const calculateWordsPerDay = useCallback(() => {
        const currentDate = new Date()
        const endDate = new Date(targetDate)
        const timeDiff = endDate.getTime() - currentDate.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
        if (daysDiff > 0 && totalWords) {
            const wordsPerDay = Math.ceil(totalWords / daysDiff)
            setWordsPerDay(wordsPerDay)

            const slowerWordsPerDay = Math.ceil(wordsPerDay * 0.8)
            const fasterWordsPerDay = Math.ceil(wordsPerDay * 1.2)

            const slowerDaysDiff = Math.ceil(totalWords / slowerWordsPerDay)
            const fasterDaysDiff = Math.ceil(totalWords / fasterWordsPerDay)

            setSlowerWordsPerDay(slowerWordsPerDay)
            setFasterWordsPerDay(fasterWordsPerDay)

            setSlowerCompletionDate(addDays(currentDate, slowerDaysDiff))
            setFasterCompletionDate(addDays(currentDate, fasterDaysDiff))
        } else {
            setWordsPerDay(null)
            setSlowerCompletionDate(null)
            setFasterCompletionDate(null)
        }
    }, [totalWords, targetDate])

    const formatNumber = (value: number) => {
        return value.toLocaleString()
    }

    const handleTotalWordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/\D/g, '')
        const numberValue = parseInt(inputValue, 10)
        if (!isNaN(numberValue)) {
            setTotalWords(numberValue)
            setFormattedTotalWords(formatNumber(numberValue))
        } else {
            setTotalWords(null)
            setFormattedTotalWords('')
        }
    }

    useEffect(() => {
        if (totalWords && totalWords > 0 && targetDate) {
            calculateWordsPerDay()
        }
    }, [totalWords, targetDate, calculateWordsPerDay])

    const formattedTargetDate = targetDate
        ? format(new Date(targetDate), 'd MMMM yyyy года', { locale: ru })
        : ''

    const formattedSlowerDate = slowerCompletionDate
        ? format(slowerCompletionDate, 'd MMMM yyyy года', { locale: ru })
        : ''

    const formattedFasterDate = fasterCompletionDate
        ? format(fasterCompletionDate, 'd MMMM yyyy года', { locale: ru })
        : ''

    return (
        <div className="flex justify-center">
            <div className="max-w-md md:mx-0 mt-10 mx-3 p-5 border border-gray-300 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-5">Рассчёт слов в день</h1>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="totalWords"
                    >
                        Всего слов
                    </label>
                    <input
                        type="text"
                        id="totalWords"
                        value={formattedTotalWords}
                        placeholder="0"
                        onChange={handleTotalWordsChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="targetDate"
                    >
                        Дата цели
                    </label>
                    <input
                        type="date"
                        id="targetDate"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {wordsPerDay !== null && (
                    <div className="mt-4 text-gray-700">
                        <p className="my-3">
                            Вам нужно писать{' '}
                            <span className="font-bold">{wordsPerDay}</span>{' '}
                            слов каждый день, чтобы достичь своей цели к{' '}
                            {formattedTargetDate}.
                        </p>
                        {slowerCompletionDate && slowerWordsPerDay && (
                            <p className="my-3">
                                Если вы будете писать{' '}
                                <span className="font-bold">
                                    {slowerWordsPerDay}
                                </span>{' '}
                                слов в день, вы закончите к{' '}
                                {formattedSlowerDate}.
                            </p>
                        )}
                        {fasterCompletionDate && fasterWordsPerDay && (
                            <p className="my-3">
                                Если вы будете писать{' '}
                                <span className="font-bold">
                                    {fasterWordsPerDay}
                                </span>{' '}
                                слов в день, вы закончите к{' '}
                                {formattedFasterDate}.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WordCount
