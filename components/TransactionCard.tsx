import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import makeBlockie from "ethereum-blockies-base64";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

type Props = {};

const TransactionCard = (props: Props) => {
    const timeAgo = new TimeAgo("en-US");
    return (
        <div className="group flex items-center justify-between rounded bg-orange-100 p-5">
            <div className="flex flex-col justify-between space-y-3 px-10">
                <p className="flex justify-between space-x-5">
                    <span className="font-mono text-xs font-semibold">#2</span>
                    <div className="flex flex-col">
                        <span className="font-mono font-semibold">
                            0x4794a6045F66e5E3fcb64d3d0e8a0f77D4df425c
                        </span>
                        <p className="font-mono font-semibold">
                            2<span className="text-xs"> ETH</span>
                        </p>
                    </div>
                </p>
            </div>
            <span className="text-xs">{timeAgo.format(new Date())}</span>
            <button className="btn-dark w-min opacity-0 group-hover:opacity-100">
                Approve
            </button>
            <div className="flex flex-col items-end justify-center space-y-4">
                <div className="flex space-x-2">
                    <div className="h-8 w-8 cursor-pointer self-start overflow-hidden rounded">
                        <img
                            src={makeBlockie(
                                "0x67B94473D81D0cd00849D563C94d0432Ac988B49"
                            )}
                            alt=""
                            className=""
                        />
                    </div>
                    <div
                        className="h-8 w-8 cursor-pointer self-start overflow-hidden rounded"
                        onClick={() => {
                            // handleUpdateSigner(null);
                        }}
                    >
                        <img
                            src={makeBlockie(
                                "0x67B94473D81D0cd00849D563C94d0432Ac988B49"
                            )}
                            alt=""
                            className=""
                        />
                    </div>
                    <div
                        className="h-8 w-8 cursor-pointer self-start overflow-hidden rounded"
                        onClick={() => {
                            // handleUpdateSigner(null);
                        }}
                    >
                        <img
                            src={makeBlockie(
                                "0x67B94473D81D0cd00849D563C94d0432Ac988B49"
                            )}
                            alt=""
                            className=""
                        />
                    </div>
                    <div
                        className="h-8 w-8 cursor-pointer self-start overflow-hidden rounded"
                        onClick={() => {
                            // handleUpdateSigner(null);
                        }}
                    >
                        <img
                            src={makeBlockie(
                                "0x67B94473D81D0cd00849D563C94d0432Ac988B49"
                            )}
                            alt=""
                            className=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
