import * as React from 'react'
import { cn } from "../../lib/utils"

import { Check, X, ChevronsUpDown } from "lucide-react"
import { Button } from "./button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "./command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"
import { Badge } from "./badge";


export type OptionType = {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: OptionType[];
    selected: string[];
    onChange?: React.Dispatch<React.SetStateAction<string[]>>;
    className?: string;
}

function MultiSelect({ options, selected, onChange, className, ...props }: MultiSelectProps) {

    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item))
    }
    return (
        <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild>
                <Button
                    // variant="outline"
                    role="combobox"
                    size='full'
                    aria-expanded={open}
                    className={`w-full justify-between bg-dark-4`}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex gap-1 flex-wrap">
                        {selected.map((item) => (
                            <Badge
                                variant="secondary"
                                key={item}
                                className="mr-1 mb-1 mt-1"
                                onClick={() => handleUnselect(item)}
                            >
                                {item}
                                <button
                                    className="ml-1  ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(item);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(item)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <ChevronsUpDown className="h-10 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
                <Command className={className}>
                    {/* <CommandInput placeholder="Search ..." /> */}
                    <CommandGroup className=''>
                        <div className=' flex max-h-64 p-2 overflow-auto flex-col '>
                            {options.map((option) => (
                                <>
                                    <Button
                                        className='relative pl-8 '
                                        variant={'ghost'}
                                        key={option.value}
                                        value={option.value}
                                        onClick={() => {
                                            onChange(
                                                selected.includes(option.value)
                                                    ? selected.filter((item) => item !== option.value)
                                                    : [...selected, option.value]
                                            )
                                            setOpen(true)
                                        }}>
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 left-2 absolute",
                                                selected.includes(option.value) ?
                                                    "opacity-100" : "opacity-0"
                                            )}
                                        />  {option.label}
                                    </Button>



                                </>
                            ))}
                        </div>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { MultiSelect }