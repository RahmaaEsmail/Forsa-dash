import React from "react";
import { routesData } from "../../../../routes/routesData";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Links() {
  return (
    <div className="mt-20 flex flex-col gap-3">
      {routesData?.map(
        (route) =>
          !route.hidden && (
            <NavLink
              key={route?.id}
              to={route?.path}
              end={route?.path === "/"} // ✅ Home exact match :contentReference[oaicite:2]{index=2}
              className="block"
            >
              {({ isActive }) => (
                <div
                  className={[
                    // row layout
                    "relative flex items-center justify-between",
                    "py-2.5 pl-6 pr-5", // padding like figma
                    "transition-colors",
                    isActive
                      ? "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-[42px] before:w-[6px] before:bg-primary before:rounded-r-full"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={isActive ? route?.active_icon : route?.inactive_icon}
                      alt={route?.name}
                      className="h-6 w-6"
                    />

                    <span
                      className={[
                        "text-base!",
                        isActive ? "text-primary! font-bold!" : "text-gray font-normal",
                      ].join(" ")}
                    >
                      {route?.name}
                    </span>
                  </div>

                  {isActive && <span
                    className={[
                      "leading-none",
                      isActive ? "text-primary" : "text-gray",
                    ].join(" ")}
                  >
                    <ChevronRight size={14} />
                  </span>}
                </div>
              )}
            </NavLink>
          )
      )}
    </div>
  );
}
