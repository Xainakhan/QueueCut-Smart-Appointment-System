import "./styles.css";
import {LocaleProvider} from "./ui";
export const metadata={title:{default:"QueueCut",template:"%s | QueueCut"},description:"Book your slot without the queue"};
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body><LocaleProvider>{children}</LocaleProvider></body></html>; }
