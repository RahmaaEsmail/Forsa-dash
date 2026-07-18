import React from "react";
import { routesData } from "../../../../routes/routesData";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useSidebar } from "../../../../context/SidebarContext";

export default function Links() {
  const { isMinimized } = useSidebar() || {};

  return (
    <div className="mt-4 flex flex-col gap-3">
      {routesData?.map(
        (route) =>
          !route.hidden && (
            <NavLink
              key={route?.id}
              to={route?.path}
              end={route?.path === "/"} // ✅ Home exact match
              className="block"
              title={isMinimized ? route?.name : undefined}
            >
              {({ isActive }) => (
                <div
                  className={[
                    // row layout
                    "relative flex items-center transition-colors",
                    isMinimized 
                      ? "py-2.5 pl-6 pr-5 justify-between md:pl-0 md:pr-0 md:justify-center" 
                      : "py-2.5 pl-6 pr-5 justify-between",
                    isActive
                      ? "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-[42px] before:w-[6px] before:bg-primary before:rounded-r-full"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    {<route.icon size={24} className={`${isActive ? "text-primary" :"text-gray-500"}`} />}

                    <span
                      className={[
                        "text-base!",
                        isActive ? "text-primary! font-bold!" : "text-gray font-normal",
                        isMinimized ? "block md:hidden" : "",
                      ].join(" ")}
                    >
                      {route?.name}
                    </span>
                  </div>

                  {isActive && (
                    <span
                      className={[
                        "leading-none",
                        isActive ? "text-primary" : "text-gray",
                        isMinimized ? "block md:hidden" : "",
                      ].join(" ")}
                    >
                      <ChevronRight size={14} />
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          )
      )}
    </div>
  );
}
