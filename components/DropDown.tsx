/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type Props = {
    menuOptions: {
        item: any;
        class?: string;
        attribute?: any;
    }[];
    defaultSelected: number;
    setState: (state: any) => void;
};

const DropDown = ({ menuOptions, defaultSelected, setState }: Props) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(defaultSelected);
    return (
        <div
            className="inline-flex w-full cursor-pointer items-stretch rounded border-2 border-transparent bg-white p-3 text-sm font-medium text-gray-900"
            onClick={() => {
                setOpen((state) => !state);
            }}
        >
            <div className="relative w-full">
                <button
                    type="button"
                    className="flex h-full w-full items-center justify-between gap-3 rounded-r px-2 hover:text-gray-700"
                >
                    <span>{menuOptions[selected].item}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="#0f172a"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {open && (
                    <div
                        className="absolute -left-3 z-10 mt-6 w-full rounded bg-teal-50 shadow-lg"
                        role="menu"
                    >
                        <div className="p-2">
                            {menuOptions.map((opt, index) => (
                                <span
                                    className="flex cursor-pointer items-center justify-between rounded px-4 py-2 text-sm hover:bg-gray-400 hover:font-medium"
                                    role="menuitem"
                                    key={index}
                                    onClick={() => {
                                        setSelected(index);
                                        setState(opt.attribute);
                                    }}
                                >
                                    {opt.item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropDown;
