//Next/React Imports
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

//Web3 Imports
import { useMoralis } from "react-moralis";
import Web3 from 'web3';
import { contractABI, contractAddress } from '../../contract';

//Component Imports
import Header from '../headerComponent';
import Footer from '../footerComponent';

//WEB3
const web3 = new Web3(Web3.givenProvider);

function mint() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    //Show Modal -- OpenSea Info
    const [show, setShow] = useState(false);

    //Name of NFT
    const [name, setName] = useState("");

    //Description of NFT
    const [description, setDescription] = useState("");

    //Uploading File
    const [selectedFile, setSelectedFile] = useState()

    //Setting Preview
    const [preview, setPreview] = useState()

    //Link of Minted NFT in testnet
    const [mintedLink, setMintedLink] = useState();

    const [isAuthenticatedState, setIsAuthenticatedState] = useState(true);

    const { isAuthenticated, user, Moralis } = useMoralis();

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const openModal = () => {
        setShow(true);
    }

    const closeModal = () => {
        setShow(false);
    }

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // In case of multiple images -- select first
        setSelectedFile(e.target.files[0])

    }

//     useEffect(() => {
//         if (!isAuthenticated) {
//             router.push('/');
//         }
//     }, [isAuthenticated, show, loading]);

    const onSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const data = selectedFile;

        try {
            //Save Image to IPFS

            const renameFile = (selectedFile, newName) => {
                return new File([selectedFile], newName, {
                    type: selectedFile.type,
                    lastModified: selectedFile.lastModified,
                });
            }

            let fileNametoIPFS = renameFile(selectedFile, "momentsnft").name;

            const file1 = new Moralis.File(fileNametoIPFS, selectedFile);

            console.log(file1);
            await file1.saveIPFS();

            const file1url = file1.ipfs();

            //generate metadata and save to IPFS

            console.log(name);
            console.log(description);
            console.log(file1url);

            const metadata = {
                name, description, image: file1url
            }

            const file2 = new Moralis.File(`${name}metadata.json`, {
                base64: Buffer.from(JSON.stringify(metadata)).toString('base64')
            })

            await file2.saveIPFS();

            const metadataurl = file2.ipfs();

            //Interact With SmartContract
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const response = await contract.methods
                .mint(metadataurl)
                .send({ from: user.get("ethAddress") });
            const tokenId = response.events.Transfer.returnValues.tokenId;

            alert(
                `Minted. Contract : ${contractAddress}, tokenID : ${tokenId}`
            )

            //Minted Link
            setMintedLink(`testnets.opensea.io/assets/rinkeby/${contractAddress}/${tokenId}/?force_update=true`);
            
            //Set Loading -> false to unmount loading svg
            setLoading(false);

            //Redirect to Success with token No. as Query
            router.push({
                pathname : '/success',
                query : {token : `${tokenId}`}
              })
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <Fragment>

            <Header data={"logout"} />
            {
                show ?
                    <div id="small-modal" tabIndex="-1" className="overflow-y-auto overflow-x-hidden fixed mt-24 top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                            {/* <!-- Modal content --> */}
                            <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
                                {/* <!-- Modal header --> */}
                                <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        Edit NFT Info to be shown in Opensea
                                    </h3>
                                    <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="small-modal">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className="p-6 space-y-6">
                                    <form>
                                        <div className="relative z-0 mb-6 w-full group">
                                            <input type="text"
                                                value={name}
                                                name="floating_nft-title" id="floating_nft-title"
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=""
                                                onChange={e => setName(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="floating_nft-title" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">NFT Title</label>
                                        </div>
                                        <div className="relative z-0 mb-6 w-full group">
                                            <input type="text"
                                                value={description}
                                                name="floating_Description" id="floating_Description"
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=""
                                                onChange={e => setDescription(e.target.value)}
                                                required />
                                            <label htmlFor="floating_Description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">NFT Description</label>
                                        </div>
                                    </form>
                                </div>
                                {/* <!-- Modal footer --> */}
                                <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

            {selectedFile ?
                <p className="text-center text-lg font-bold text-gray-500 lg:text-xl dark:text-gray-400 mb-6">Edit Info and you are ready to Mint!</p>
                :
                <>
                    <p className="text-center text-lg font-bold text-gray-500 lg:text-xl dark:text-gray-400 mb-6">Upload your moment</p>
                </>
            }

            <div style={{ margin: 'auto' }}>
                <form onSubmit={onSubmit}>

                    <div className="flex justify-center items-center">
                        {
                            selectedFile ?

                                <Image src={preview} alt="nft-preview" width={"400px"} height={"356px"} />
                                :
                                <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                        <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" onChange={onSelectFile} />
                                </label>
                        }
                    </div>
                    <div className='flex items-center justify-center'>
                        {
                            selectedFile ?

                                <>
                                    <button type="button" onClick={openModal} className="text-black bg-cyan-50 font-medium rounded-lg text-md px-14 py-2 text-center mt-2 mr-2">
                                        Edit Info
                                    </button>

                                    {/* Loading Animation */}
                                    {
                                        name === "" || description === "" ?
                                            <button
                                                type='button'
                                                className="cursor-not-allowed text-gray-400 bg-gray-300 font-medium rounded-lg text-md px-14 py-2 text-center mt-2"
                                                disabled
                                            >
                                                Mint Now
                                            </button>
                                            :

                                            (
                                                loading ?
                                                    <button
                                                        type='submit'
                                                        className="text-white bg-gradient-to-r from-cyan-400 to-blue-600 font-medium rounded-lg text-md px-14 py-2 text-center mt-2">
                                                        <svg role="status" className="mb-1 inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                        </svg>
                                                        Minting
                                                    </button>
                                                    :
                                                    <button
                                                        type='submit'
                                                        className="text-white bg-gradient-to-r from-cyan-400 to-blue-600 font-medium rounded-lg text-md px-14 py-2 text-center mt-2">
                                                        Mint Now
                                                    </button>
                                            )

                                    }
                                </>
                                :
                                <>
                                </>
                        }
                    </div>
                </form>
            </div>


            <Footer />
        </Fragment>
    )
}

export default mint
