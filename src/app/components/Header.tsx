//tailwind
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

//other imports
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import Span from './Span'
import imgReload from '../../../public/assets/images/refresh.png'
import userIcon from '../../../public/assets/images/user.png'
import { api } from '../lib/api'
import { getCookie } from 'cookies-next'

/*const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]

const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]*/

export default function Header(){

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, saldo, getSaldo } = useContext(AuthContext)

    const [ saldoControlado, setSaldoControlado ] = useState<number | null>(null)

    const [rotation, setRotation] = useState(0);

    const [logOutModal, setLogOutModal] = useState(false)

    const [file, setFile] = useState<File | null>(null)
    const [uploadModal, setUploadModal] = useState(false)

    useEffect(() => {
        effectSaldo()
    }, [])

    const effectSaldo = async () => {
        const res = await getSaldo()
        setSaldoControlado(res)
    }
    
    useEffect(() => {
        setSaldoControlado(saldo)
    }, [saldo])
    

    useEffect(() => {
        getColor()
    }, [saldoControlado])

    const getColor = () => {
        if(saldoControlado) return saldoControlado >= 0.0 ? 6 : 1;
        else return 6
    }

    const handleClick = async () => {
        setRotation(rotation + 360)
        const res = await getSaldo()
        setSaldoControlado(res)
    }

    useEffect(() => {
        console.log(file)
    }, [file])

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

        console.log("uploading image...")

        const selectedFile = event.target.files ?  event.target.files[0] : null;
        setFile(selectedFile);

        // Enviar a foto para a API diretamente após a seleção
        if (selectedFile) {
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("key", "3101a1a3c1d7f0847eac2c188da16398");
            
            const res = await fetch("https://api.imgbb.com/1/upload", {
                method: "POST",
                body: formData,
            });
            
            const data = await res.json();
            const url = data.data.image.url
            const deleteUrl = data.data.delete_url
            console.log(url); // URL da imagem
            const userId = user?.id

            await fetch(`${api}/upload`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCookie('account_token')}`,
                },
                body: JSON.stringify({ userId, url }),
            });


              
        }
        setUploadModal(false)
    }

    const clearCookie = () => {
        document.cookie = "account_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        window.location.href = '/';
    }

    if(saldo === null) return null;

    return (
        <div>
            <header className="bg-white">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1 items-start justify-start">
                        <div className="w-3/5 items-center flex justify-between">

                            <a  className="-m-1.5 p-1.5">
                            <span className="sr-only">Your </span>
                            <img
                                onClick={() => setUploadModal(prev => !prev)}
                                alt=""
                                src={user?.avatarURL ? user.avatarURL : userIcon.src}
                                className="cursor-pointer h-8 w-auto min-w-8 rounded-2xl"
                            />
                            </a>
                            <span className='text-center justify-center min-w-32 lg:inline'>
                                Saldo: <Span category_id={getColor()} value={saldoControlado ? saldoControlado.toString() : "0.0"}></Span> R$
                            </span>
                            <img 
                            style={{ transform: `rotate(${rotation}deg)` }} 
                            className='rounded-full transition-transform duration-300 cursor-pointer w-4 ' 
                            src={imgReload.src} 
                            alt="reload"
                            onClick={handleClick}
                            />
                        </div>
                    </div>
                    <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                    </div>
                    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    {/*<Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                        Product
                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                        </PopoverButton>

                        <PopoverPanel
                        transition
                        className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                        <div className="p-4">
                            {products.map((item) => (
                            <div
                                key={item.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                            >
                                <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                                </div>
                                <div className="flex-auto">
                                <a href={item.href} className="block font-semibold text-gray-900">
                                    {item.name}
                                    <span className="absolute inset-0" />
                                </a>
                                <p className="mt-1 text-gray-600">{item.description}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                            {callsToAction.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                            >
                                <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                                {item.name}
                            </a>
                            ))}
                        </div>
                        </PopoverPanel>
                    </Popover>*/}

                    <Link href="/transactions" className="text-sm/6 font-semibold text-gray-900">
                        Transactions
                    </Link>
                    <Link href="/dashboard" className="text-sm/6 font-semibold text-gray-900">
                        Dashboard
                    </Link>
                    </PopoverGroup>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a onClick={() => setLogOutModal(true)} className="text-sm/6 font-semibold cursor-pointer text-gray-900">
                        Log out <span aria-hidden="true">&rarr;</span>
                    </a>
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto"
                        />
                        </a>
                        <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                            {
                            /*<Disclosure as="div" className="-mx-3">
                            <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                Product
                                <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 space-y-2">
                                {[...products, ...callsToAction].map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    {item.name}
                                </DisclosureButton>
                                ))}
                            </DisclosurePanel>
                            </Disclosure>*/
                            }
                            <a
                            href="/transactions"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                            >
                            Transactions
                            </a>
                            <Link
                            href="/dashboard"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                            >
                            Dashboard
                            </Link>
                        </div>
                        <div className="py-6">
                            <a
                            onClick={() => setLogOutModal(true)}
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50"
                            >
                            Log out
                            </a>
                        </div>
                        </div>
                    </div>
                    </DialogPanel>
                </Dialog>
            </header>
            {logOutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white flex items-center p-6 rounded-lg shadow-lg w-96 h-1/4"
                >
                    <div className='w-full h-2/3 flex flex-col justify-around items-center'>
                        <h2>Want Log Out?</h2>
                        <div className='w-1/2 flex justify-around'>
                            <button className='hover:bg-blue-600 px-2 hover:text-white rounded-sm' onClick={() => setLogOutModal(false)}>Não</button>
                            <button className='hover:bg-red-600 px-2 hover:text-white rounded-sm' onClick={clearCookie}>Sim</button>
                        </div>
                    </div>
                </motion.div>
                </div>
            )}
            {uploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center p-6 rounded-lg shadow-lg w-96 h-1/4"
                >
                    <form className="flex flex-col items-center justify-center w-full">
                        <button
                        onClick={() => {setUploadModal(false)}}
                        className='bg-red-600 rounded-full text-white px-2 self-end text-center'
                        >X</button>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" onChange={handleFileChange} type="file" className='hidden' />
                        </label>
                    </form> 
                </motion.div>
                </div>
            )}
        </div>
    );
}

