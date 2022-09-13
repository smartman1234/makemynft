//Next/React Imports
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

//Web3 Imports
import { useMoralis } from "react-moralis";

//Component Imports
import confettiImage from '../../public/successConfetti.png';
import Header from '../headerComponent';
import Footer from '../footerComponent';


function success() {

    const router = useRouter();

    const [data, setData] = useState("logout")

    const { isAuthenticated } = useMoralis();


    useEffect(() => {

        if (!isAuthenticated) {
            setData();
        }

    }, [isAuthenticated]);

    const [userName, setUserName] = useState("")

    //Fetch params
    useEffect(() => {
        setUserName(router.query);
    }, [userName])

    console.log(userName);

    return (
        <Fragment>

            {data ?
                <Header data={data} />
                :
                <Header />
            }

            <div className="flex items-center justify-center mt-24">
                <div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className='ml-8'>
                            <Image src={confettiImage} width={"150px"} height={"150px"} />
                        </div>
                        <h1 className="text-4xl font-bold">Your moment is now <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-cyan-400">Eternal</span></h1>
                        <p>It might take upto a day for your NFT to be displayed on OpenSea</p>
                        <a
                            className="inline-flex items-center px-4 py-2 text-white bg-gradient-to-r to-blue-600 from-cyan-400 rounded rounded-full hover:bg-indigo-700 focus:outline-none focus:ring"
                            type='button'
                            href={`https://testnets.opensea.io/assets/rinkeby/0x427554E23E74a95491EE168c8dF953E7Cb8FF187/${userName.token}?force_update=true`}
                        >
                            
                            <span className="text-sm font-medium">
                                View in OpenSea
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </Fragment>
    )
}

export default success