import { ICreatePetForm } from '../pages/DashboardPage/constants'

import axios from './axiosInstance'
import { resizeImages } from './utils/resizeImages'

export const getPets = async ({
  page,
  city,
  gender,
  adopted,
  country,
  category,
}: {
  city?: string
  country?: string
  page?: number
  gender?: string
  category?: string
  adopted?: boolean
}) => {
  const params = new URLSearchParams()
  
  if (category) params.append('category', category)
  if (adopted !== undefined) params.append('adopted', String(adopted))
  if (gender) params.append('gender', gender)
  if (page) params.append('page', String(page))
  if (country) params.append('country', country)
  if (city) params.append('city', city)
  
  const queryString = params.toString()
  const url = queryString ? `/api/v1/pets?${queryString}` : '/api/v1/pets'
  
  const response = await axios.get(url)
  return response.data
}

export const getUserPets = async ({
  id,
  page,
  gender,
  adopted,
  category,
  searchByName,
}: {
  id: string
  page?: number
  gender?: string
  category?: string
  searchByName?: string
  adopted?: boolean | string
}) => {
  const params = new URLSearchParams()
  
  params.append('userId', id)
  if (category) params.append('category', category)
  if (adopted !== undefined && adopted !== '') params.append('adopted', String(adopted))
  if (gender) params.append('gender', gender)
  if (searchByName) params.append('searchByName', searchByName)
  if (page) params.append('page', String(page))
  
  const response = await axios.get(`/api/v1/pets/user?${params.toString()}`)
  return response.data
}

export const getPet = async (id: string) => {
  const response = await axios.get(`/api/v1/pets/${id}`, {
    withCredentials: true,
  })

  return response.data
}

export const getMedicalRecord = async (id: string) => {
  const response = await axios.get(`/api/v1/pets/medicalRecord/${id}`, {
    withCredentials: true,
  })

  return response.data
}

export const deletePet = async (petId: string) => {
  const response = await axios.delete(`/api/v1/pets/${petId}`)
  return response.data
}

export const createPet = async (data: ICreatePetForm) => {
  const formData = new FormData()

  Object.keys(data).forEach((key: string) => {
    if (
      typeof data[key] === 'object' &&
      data[key] !== null &&
      !(data[key] instanceof File)
    ) {
      formData.append(key, JSON.stringify(data[key]))
    } else if (key !== 'newImages' && key !== 'qrCode') {
      formData.append(key, data[key])
    }
  })

  if (data.newImages.length > 0 && Array.isArray(data.newImages)) {
    data.newImages.forEach((image: { file: File }) => {
      formData.append('newImages', image.file)
    })
  }

  const response = await axios.post(`/api/v1/pets`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const updatePet = async (data: ICreatePetForm) => {
  const formData = new FormData()

  Object.keys(data).forEach((key: string) => {
    if (
      typeof data[key] === 'object' &&
      data[key] !== null &&
      !(data[key] instanceof File)
    ) {
      formData.append(key, JSON.stringify(data[key]))
    } else if (key !== 'id') {
      formData.append(key, data[key])
    }
  })

  const resizedImages = await resizeImages(data.images)

  resizedImages.forEach((resizedImage: string | Blob) => {
    formData.append('newImages', resizedImage)
  })

  const imagesDeleted = data.images.filter(
    (image: { isDeleted: boolean }) => image.isDeleted,
  ) as []

  if (imagesDeleted.length > 0) {
    formData.append('deleteFiles', JSON.stringify(imagesDeleted))
  }

  const response = await axios.put(`/api/v1/pets/${data.id}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
