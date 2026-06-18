import React from "react"
import LeftSide from "./_components/left-side"
import RightSide from "./_components/right-side"

const Account = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex-1">
        <LeftSide />
      </div>
      <div className="hidden md:block md:w-1/2 lg:w-[55%]">
        <RightSide />
      </div>
    </div>
  )
}

export default Account
