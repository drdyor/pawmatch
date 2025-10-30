import { useQuery } from 'react-query'

import { getPets } from '../../api/pet'

export const useGetPets = ({
  page,
  city,
  gender,
  country,
  adopted,
  category,
}: {
  page?: number
  city?: string
  gender?: string
  country?: string
  adopted?: boolean
  category?: string
}) => {
  const { data, error, isLoading, refetch } = useQuery(
    ['pets', category, gender, adopted, page, country, city],
    () => getPets({ category, gender, adopted, page, country, city }),
    {
      // Don't retry on error in demo mode
      retry: false,
      // Use stale data if fetch fails
      staleTime: 5 * 60 * 1000,
      // Don't throw errors, just return them
      useErrorBoundary: false,
    }
  )

  return { data, error, isLoading, refetch }
}
