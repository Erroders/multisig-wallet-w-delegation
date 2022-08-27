import React from "react";

type Props = { children: React.ReactNode };

const RightPane = ({ children }: Props) => {
    return <div className="col-span-4 bg-gray-100">{children}</div>;
};

export default RightPane;
