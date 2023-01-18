//Next/React Imports
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

//Web3 Imports
import { useMoralis } from "react-moralis";
import Web3 from 'web3';

//Component Imports
import nftImage from '../../public/nftCard.jpg';
import Header from '../headerComponent';
import Footer from '../footerComponent';


const web3 = new Web3(Web3.givenProvider);

function createnft() {

    //Hook to download form image
    const downloadFormImg = useRef();

    const router = useRouter();

    //Loading Ani
    const [loading, setLoading] = useState(false);

    //Uploading File
    const [selectedFile, setSelectedFile] = useState()

    //Setting Preview
    const [preview, setPreview] = useState()

    const [downloadState, setDownloadState] = useState(false);
    
    const { isAuthenticated } = useMoralis();

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    //On Selecting  a custom image file
    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // Select first file in case of multiple inputs
        setSelectedFile(e.target.files[0])
    }

    //Dynamically import react-component-export-image
    useEffect(() => {

        if (downloadState) {
            const abcjsInit = async () => {
                const { exportComponentAsPNG } = await import("react-component-export-image");
                exportComponentAsPNG(downloadFormImg)
            };
            abcjsInit();
        }
    }, [downloadState]);

    //Redirect to homepage if not authenticated
//     useEffect(() => {
//         if (!isAuthenticated) {
//             router.push('/');
//         }

//     }, [isAuthenticated, loading]);

    //TextArea Auto-adjust Function
    function handleKeyDown(e) {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        e.target.style.width = `350px`;
    }

    //Redirect to Minting
    const mintNft = () => {
        setLoading(true);
        setDownloadState(true);
        router.push('/mint');
    }

    return (
        <Fragment>

            <Header data={"logout"} />

            <div className='flex items-center justify-center mb-1'>
                <input
                    type="file"
                    onChange={onSelectFile}
                    style={{ width: "400px" }}
                    className="block text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
            </div>

            {/* Form which will be downloaded */}
            <div ref={downloadFormImg} style={{ width: "400px", margin: 'auto' }}>
                <form >
                    <div className="m-auto max-w-sm rounded overflow-hidden">
                        {
                            selectedFile ?
                                <Image src={preview} alt="NFT-Preview" height={"225px"} width={"400"} />
                                :
                                <Image className="w-full" src={nftImage} alt="Dhoni Image" height={"225px"} />
                        }
                        <div className="px-6 py-2">
                            <div className="font-bold text-md relative">
                                <input spellCheck="false" maxLength={"30"} type="text" className="border-0 border-b-2 border-gray-100 rounded-t-lg w-full text-md text-gray-900 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="NFT Title - Dhoni finishes off in style" />
                            </div>
                            <div className="text-gray-700 text-md">
  
                                <span>
                                    <textarea spellCheck="false" maxLength={"150"} cols={"45"} onKeyDown={handleKeyDown} placeholder="Your NFT Description here" />
                                </span>
                            </div>
                        </div>
                        <div className="px-5">
                            <span className="inline-block bg-gray-200 rounded-full px-1 pl-5 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                <input type="date" className="bg-transparent w-full datepicker-input" placeholder="Select date" />
                            </span>
                        </div>
                    </div>

                </form>
            </div>
  
            {/* Download NFT or Mint NFT button*/}
            <div className='flex items-center justify-center'>
                <button onClick={(e) => {

                    setDownloadState(true)
                }} className="text-black bg-cyan-50 font-medium rounded-lg text-md px-14 py-2 text-center mt-2 mr-2">Download</button>
                {
                    loading ?
                        <button
                            onClick={mintNft}
                            className="text-white bg-gradient-to-r from-cyan-400 to-blue-600 font-medium rounded-lg text-md px-14 py-2 text-center mt-2">
                            <svg role="status" className="mb-1 inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                            Minting
                        </button>
                        :
                        <button
                            onClick={mintNft}
                            className="text-white bg-gradient-to-r from-cyan-400 to-blue-600 font-medium rounded-lg text-md px-14 py-2 text-center mt-2">Mint Now</button>
                }

            </div>

            <Footer />
        </Fragment>
    )
}

export default createnft
