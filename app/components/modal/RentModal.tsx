'use client'

import useRentModal from '@/app/hook/useRentModal'
import Modal from './Modal'
import { useMemo, useState } from 'react'
import Heading from '../Heading'
import { categories } from '../navber/Categories'
import CategoriyInput from '../inputs/CategoriyInput'
import { FieldValues, useForm } from 'react-hook-form'
import CountrySelect from '../inputs/CountrySelect'

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const rentModal = useRentModal()

  const [step, setStep] = useState(STEPS.CATEGORY)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageScr: '',
      price: 1,
      title: '',
      description: '',
    },
  })

  const category = watch('category')
  const location = watch('location')

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const onBack = () => {
    setStep((value) => value - 1)
  }

  const onNext = () => {
    setStep((value) => value + 1)
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Create'
    }

    return 'Next'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Back'
  }, [step])

  let bodyContent = (
    <>
      {step == STEPS.CATEGORY && (
        <div className="flex flex-col gap-8">
          <Heading
            title="Which of these best describes your place?"
            subtitle="Pick a category"
          />
          <div
            className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            gap-3
            max-h-[50vh]
            overflow-y-auto
        "
          >
            {categories.map((item) => (
              <div key={item.label} className="col-span-1">
                <CategoriyInput
                  onClick={(category) => {
                    setCustomValue('category', category)
                  }}
                  icon={item.icon}
                  label={item.label}
                  selected={category == item.label}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {step == STEPS.LOCATION && (
        <div className="flex flex-col gap-9">
          <Heading
            title="Where is your place located?"
            subtitle="Help guests find you!"
          />
          <CountrySelect
            value={location}
            onChange={(value) => setCustomValue('location', value)}
          />
          <Map />
        </div>
      )}
    </>
  )

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={onNext}
      actionLabel={actionLabel}
      title="Airbnb your home!"
      secondaryActionLable={secondaryActionLabel}
      secondaryAction={step == STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    ></Modal>
  )
}

export default RentModal
