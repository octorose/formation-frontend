import { HistoryIcon, Link } from 'lucide-react';
import React from 'react'
import DynamicArrow from '../../../../public/assets/Icons/DynamicArrow';
import SidebarLinkGroup from './SidebarLinkGroup';
import CandidatIcon from '../../../../public/assets/Icons/CandidatIcon';
import DashIcon from '../../../../public/assets/Icons/Dashboard';
import SettingIcon from '../../../../public/assets/Icons/SettingIcon';

function RH({pathname, sidebarExpanded, setSidebarExpanded} : {pathname: string, sidebarExpanded: boolean, setSidebarExpanded: any}) {
  return (
    <div>
        
           <SidebarLinkGroup
                    activeCondition={
                      pathname === "/forms" || pathname.includes("forms")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href="/calendar"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              pathname.includes("calendar") &&
                              "bg-graydark dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <CandidatIcon />
                            Candidates
                            <DynamicArrow open={open} />
                          </Link>
                          <div
                            className={`translate transform overflow-hidden  ${
                              !open && "hidden"
                            }`}
                          >
                            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Details
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Add Manually
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <SidebarLinkGroup
                    activeCondition={
                      pathname === "/forms" || pathname.includes("forms")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href="/calendar"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              pathname.includes("calendar") &&
                              "bg-graydark dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <HistoryIcon />
                            History
                            <DynamicArrow open={open} />
                          </Link>
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && "hidden"
                            }`}
                          >
                            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Supervisors
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Groups
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/#"
                                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                    pathname === "/#" && "text-white"
                                  }`}
                                >
                                  Tests
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <li>
                    <Link
                      href="/settings"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("settings") &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <SettingIcon />
                      Settings
                    </Link>
                  </li>
    </div>
  
  )
}

export default RH