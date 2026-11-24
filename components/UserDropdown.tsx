'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NavItems from "@/components/NavItems";


const UserDropdown = ({user, initialStocks}: {user: User, initialStocks: StockWithWatchlistStatus[]}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                <Avatar className="h-8 w-8">
                    {/*<AvatarImage src="https://avatars.githubusercontent.com/u/153423955?s=280&v=4" />*/}
                     <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                        {user.name[0]}
                    </AvatarFallback>
                </Avatar>

                <div className="hidden md:flex flex-col items-start">
                  <span className="text-base font-medium text-gray-400">
                    {user.name}
                  </span>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 text-gray-400">

                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <div className="flex items-center gap-3 py-2">
                            <Avatar className="h-10 w-10">
                                {/*<AvatarImage src="https://avatars.githubusercontent.com/u/153423955?s=280&v=4" />*/}
                                <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                    {user.name[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
                                <span className="text-sm text-gray-500">
              {user.email}
            </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="sm:hidden bg-gray-600"/>

                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks}/>
                </nav>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown
