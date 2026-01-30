import React from 'react'

export default function LoginImage() {
  return (
    <div className="relative rounded-[40px] min-h-85 lg:min-h-140">
            <img
              src="/images/4db54ec7500109d260ae6bf831f912cbcf6e5fb9.jpg"
              alt="Forsa login banner"
              className="absolute inset-0 h-full w-full object-cover rounded-[40px]"
              loading="lazy"
            />

            <div className="absolute bottom-4 left-4 right-4 rounded-main bg-white/60 p-5 text-center">
              <p className="text-secondary text-lg lg:text-xl font-medium leading-relaxed whitespace-pre-line">
                {
                  "Forsa for Empowering Your Opportunities,\nBuilding Stronger Futures.\nYour one-stop supplier"
                }
              </p>
            </div>
          </div>
  )
}
