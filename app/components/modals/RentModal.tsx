'use client'

import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '@/app/hooks/useRentModal'
import Heading from '../Heading'
import { categories } from '../navbar/Categories'
import CategoryInput from '../inputs/CategoryInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import CountrySelect from '../inputs/CountrySelect'
import dynamic from 'next/dynamic'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import Input from '../inputs/Input'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// In TypeScript, an enum (short for enumeration) is a data type that allows you to define a set of named constants. Enums provide a way to create a collection of related values that can be referred to by their names instead of using raw values.

enum STEPS{
  CATEGORY = 0, 
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4, 
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {register, handleSubmit, setValue, watch, 
    formState: {
      errors,
    },
  reset} = useForm<FieldValues>({
    defaultValues:{
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: "",
      description: '',
    }
  });
  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

  // The options object passed to dynamic contains the property ssr set to false. This means that the component should not be server-side rendered. It will be loaded lazily on the client side instead.

// Finally, the second argument of the useMemo hook is an array of dependencies. Whenever any of the dependencies in the array changes, the memoized value will be recomputed. In this case, the location variable is specified as the dependency. This means that whenever the location value changes, the Map component will be dynamically imported again.
  
  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
  }), [location]); 

  const setCustomvalue  = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if(step !== STEPS.PRICE){
      return onNext();
    }

    setIsLoading(true);
    axios.post("/api/listings", data)
    .then(() => {
      toast.success('Listing Created');
      router.refresh();
      reset();  // if the form is succesfully created then we want to reset the entire form 
      setStep(STEPS.CATEGORY);
      rentModal.onClose();
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // Display the actual error message received from the server
        toast.error(error.response.data.message);
      } else {
        // An error occurred before the request was made or during the request setup
        toast.error('Something went wrong');
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

// Remember to use useMemo when you have a specific value or result that needs to be memoized based on certain dependencies, as it can improve performance and reduce unnecessary work in your components.

  const actionLabel = useMemo(() => {
    if(step === STEPS.PRICE){ 
      return 'Create'  // if we are on the last step 
    }

    return 'Next';
  }, [step]); 

  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS.CATEGORY){
      return undefined;  // if we are on the first steps then retrun undefined
    }

    return 'Back';
  }, [step])

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <Heading
      title='Which of these best describes your place?'
      subtitle='Pick a category'
      />
      <div className='
      grid
      grid-cols-1
      md:grid-cols-2
      gap-3
      max-h-[50vh]
      overflow-y-auto
      '>
        {categories.map((item) => (
          <div key={item.label} className='col-span-1'>
            <CategoryInput
            onClick={(category) => setCustomvalue('category', category)}
            selected={category === item.label}
            label={item.label}
            icon={item.icon}
             />
          </div>
        )) }
      </div>
    </div>
  )

  if(step === STEPS.LOCATION){
    bodyContent = ( 
      <div className='flex flex-col gap-8'>
        <Heading 
        title='Where is your place located?'
        subtitle='Help guests find you!'
        />
        <CountrySelect
        value={location} 
        onChange={(value) => setCustomvalue('location', value)}
        />
        <Map
        center={location?.latlng}  // latlng -->> latitude and longitude
         />
      </div>
    )
  }

  if(step === STEPS.INFO){
    bodyContent = ( 
      <div className='flex flex-col gap-8'>
        <Heading 
        title='Share some basics about your place'
        subtitle='What amenities do you have?'
        />
        <Counter
        title= "Guests"
        subtitle= "How many guests do you allow?"
        value={guestCount}
        onChange={(value) => setCustomvalue("guestCount", value)}
        />
        <hr />
        <Counter
        title= "Rooms"
        subtitle= "How many rooms do you have?"
        value={roomCount}
        onChange={(value) => setCustomvalue("roomCount", value)}
        />
        <hr />
        <Counter
        title= "Bathrooms"
        subtitle= "How many bathrooms do you have?"
        value={bathroomCount}
        onChange={(value) => setCustomvalue("bathroomCount", value)}
        />
      </div>
    )
  }

  if(step === STEPS.IMAGES){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
        title='Add a photo of your place'
        subtitle='Show guests what your place looks like'
        />
        <ImageUpload 
        value={imageSrc}
        onChange={(value) => setCustomvalue('imageSrc', value)}
        />
      </div>
    )
  }

  if(step === STEPS.DESCRIPTION){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
        title='How would you describe you place?'
        subtitle='Short and sweet works best!'
        />
        <Input
        id='title'
        label='Title'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />
      <hr />
      <Input
        id='description'
        label='Description'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />
      </div>
    )
  }

  if(step === STEPS.PRICE){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
        title='Now, set your price'
        subtitle='How much do you charge per night?'
        />
      <Input
      id='price'
      label='Price'
      formatPrice
      type='number'
      disabled={isLoading}
      register={register}
      errors={errors}
      required
      />

      </div>
    )
  }

  return (
    <Modal
    isOpen={rentModal.isOpen}
    onClose={rentModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    actionLabel={actionLabel}
    secondaryActionLabel={secondaryActionLabel}
    secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    title='Airbnb your home'
    body={bodyContent}
    />
  )
}

export default RentModal