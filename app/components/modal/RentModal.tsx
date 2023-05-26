'use client'

import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import useRentModal from '@/app/hook/useRentModal'

import Heading from '../Heading'
import CategoriyInput from '../inputs/CategoriyInput'
import Counter from '../inputs/Counter'
import CountrySelect from '../inputs/CountrySelect'
import ImageUpload from '../inputs/ImageUpload'
import Input from '../inputs/Input'
import { categories } from '../navber/Categories'
import Modal from './Modal'

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter()
  const rentModal = useRentModal()

  const [step, setStep] = useState(STEPS.CATEGORY)
  const [isLoading, setIsLoading] = useState(false)

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
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
    },
  })

  const category = watch('category')
  const location = watch('location')
  const guestCount = watch('guestCount')
  const roomCount = watch('roomCount')
  const bathroomCount = watch('bathroomCount')
  const imageSrc = watch('imageSrc')

  const Map = useMemo(
    () => dynamic(() => import('../Map'), { ssr: false }),
    [location],
  )

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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step != STEPS.PRICE) {
      return onNext()
    }

    setIsLoading(true)

    axios
      .post('api/listing', data)
      .then(() => {
        toast.success('Listing created')
        router.refresh()
        reset()
        setStep(STEPS.CATEGORY)
        rentModal.onClose()
      })
      .catch((error: any) => toast.error('SOME error ' + error))
      .finally(() => setIsLoading(false))
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
        <div className="flex flex-col gap-8">
          <Heading
            title="Where is your place located?"
            subtitle="Help guests find you!"
          />
          <CountrySelect
            value={location}
            onChange={(value) => {
              setCustomValue('location', value)
            }}
          />
          <Map center={location?.latlng} />
        </div>
      )}
      {step == STEPS.INFO && (
        <div className="flex flex-col gap-9">
          <Heading
            title="Share some basics about your place"
            subtitle="What amenitis do you have?"
          />
          <Counter
            title="Guests"
            subtitle="How many guests do you allow?"
            value={guestCount}
            onChange={(value) => setCustomValue('guestCount', value)}
          />
          <hr />
          <Counter
            onChange={(value) => setCustomValue('roomCount', value)}
            value={roomCount}
            title="Rooms"
            subtitle="How many rooms do you have?"
          />
          <hr />
          <Counter
            onChange={(value) => setCustomValue('bathroomCount', value)}
            value={bathroomCount}
            title="Bathrooms"
            subtitle="How many bathrooms do you have?"
          />
        </div>
      )}
      {step == STEPS.IMAGES && (
        <div className="flex flex-col gap-9">
          <Heading
            title="Add a photo of your place"
            subtitle="Show guests what your place looks like!"
          />
          <ImageUpload
            onChange={(value) => {
              setCustomValue('imageSrc', value)
            }}
            value={imageSrc}
          />
        </div>
      )}
      {step == STEPS.DESCRIPTION && (
        <div className="flex flex-col gap-9">
          <Heading
            title="How would you describe your place?"
            subtitle="Short and sweet works best!"
          />

          <Input
            id="title"
            label="title"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <hr />

          <Input
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
      )}
      {step == STEPS.PRICE && (
        <div className="flex flex-col gap-9">
          <Heading
            title="Now, set your price"
            subtitle="How much do you charge per night?"
          />

          <Input
            id="price"
            label="price"
            disabled={isLoading}
            register={register}
            errors={errors}
            type={'number'}
            formatPrice
            required
          />
        </div>
      )}
    </>
  )

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      title="Airbnb your home!"
      secondaryActionLable={secondaryActionLabel}
      secondaryAction={step == STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    ></Modal>
  )
}

export default RentModal
