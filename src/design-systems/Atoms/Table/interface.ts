interface ColumnProps<T> {
  name: string
  selector: (item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'right' | 'center'
  headingClassName?: string
  itemClassName?: string
}

interface Pagination {
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetching: boolean
}

interface TablePropsWithPagination<T> {
  data: T[]
  columns: ColumnProps<T>[]
  className?: string
  isLoading?: boolean
  activePagination: true
  pagination: Pagination
}

interface TablePropsWithoutPagination<T> {
  data: T[]
  columns: ColumnProps<T>[]
  className?: string
  isLoading?: boolean
  activePagination: false
  pagination?: undefined
}

export type TableProps<T> = TablePropsWithPagination<T> | TablePropsWithoutPagination<T>
