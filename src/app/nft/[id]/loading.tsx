import Spinner from '@/design-systems/Atoms/Spinner'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="my-4 flex h-full w-full items-center justify-center">
      <Spinner className="h-10 w-10 animate-spin" />
    </div>
  )
}
