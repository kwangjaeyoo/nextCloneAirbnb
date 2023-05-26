'use client'

import { formatISO } from 'date-fns'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useMemo, useState } from 'react'
import { Range } from 'react-date-range'

import useSearchModal from '@/app/hook/useSearchModel'

import Heading from '../Heading'
import Calendar from '../inputs/Calendar'
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect'
import Modal from './Modal'
import Counter from '../inputs/Counter'

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter()

  const searchModal = useSearchModal()
  const params = useSearchParams()

  const [step, setStep] = useState(STEPS.LOCATION)

  const [location, setLocation] = useState<CountrySelectValue>()
  const [guestCount, setGuestCount] = useState(1)
  const [roomCount, setRoomCount] = useState(1)
  const [bathroomCount, setBathroomCount] = useState(1)

  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  const Map = useMemo(
    () =>
      dynamic(() => import('../Map'), {
        ssr: false,
      }),
    [location],
  )

  const onBack = useCallback(() => {
    setStep((value) => value - 1)
  }, [])

  const onNext = useCallback(() => {
    setStep((value) => value + 1)
  }, [])

  const onSubmit = useCallback(() => {
    if (step !== STEPS.INFO) {
      return onNext()
    }

    let currentQuery = {}

    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    }

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate)
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate)
    }

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true },
    )

    setStep(STEPS.LOCATION)
    searchModal.onClose()
    router.push(url)
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params,
  ])

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search'
    }

    return 'Next'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined
    }

    return 'Back'
  }, [step])

  const bodyContent = (
    <div className="flex flex-col gap-8">
      {step === STEPS.LOCATION && (
        <>
          <Heading
            title="Where do you wanna go?"
            subtitle="Find the perfect location!"
          />
          <CountrySelect
            value={location}
            onChange={(value) => setLocation(value as CountrySelectValue)}
          />
          <hr />
          <Map center={location?.latlng} />
        </>
      )}
      {step === STEPS.DATE && (
        <>
          <Heading
            title="When do you plan to go?"
            subtitle="Make sure everyone is free!"
          />
          <Calendar
            onChange={(value) => setDateRange(value.selection)}
            value={dateRange}
          />
        </>
      )}
      {step === STEPS.INFO && (
        <>
          <Heading
            title="More information"
            subtitle="Find your perfect place!"
          />
          <Counter
            onChange={(value) => setGuestCount(value)}
            value={guestCount}
            title="Guests"
            subtitle="How many guests are coming?"
          />
          <hr />
          <Counter
            onChange={(value) => setRoomCount(value)}
            value={roomCount}
            title="Rooms"
            subtitle="How many rooms do you need?"
          />
          <hr />
          <Counter
            onChange={(value) => {
              setBathroomCount(value)
            }}
            value={bathroomCount}
            title="Bathrooms"
            subtitle="How many bahtrooms do you need?"
          />
        </>
      )}
    </div>
  )
  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel={actionLabel}
      secondaryActionLable={secondaryActionLabel}
      onClose={onBack}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default SearchModal
