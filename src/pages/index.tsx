import Image from "next/image";
import { Inter } from "next/font/google";
import App from "next/app";
import Timeline from "../components/Timeline"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div><Timeline /></div>
  )
}
