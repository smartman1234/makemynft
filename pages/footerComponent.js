import styles from '../styles/Home.module.css'

export default function Footer() {
    return (
        <div className={styles.container}>

            <footer className="footerSection fixed bottom-0 left-0 w-full shadow md:flex md:items-center md:justify-between md:p-1">
                <span className="text-sm text-gray-500 sm:text-center md:px-12 py-2.5">© 2022 <a href="#" className="hover:underline">Neeraj and Hardik</a>
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="#" className="mr-12 hover:underline md:mr-12 ">Find us on social</a>
                    </li>
                </ul>
            </footer>


        </div>
    )
}
