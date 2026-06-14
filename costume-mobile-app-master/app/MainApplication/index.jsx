import { Redirect } from "expo-router";

export default function EntryPoint() {
    // Si quelqu'un arrive sur /MainApplication, on l'envoie sur votre page Main
    return <Redirect href="/MainApplication/Main" />;
}