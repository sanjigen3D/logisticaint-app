import { SafeAreaView } from "react-native";
import PortSearchForm from "@/components/forms/PortSearchForm";

export default function Index() {
  return (
    <SafeAreaView style={{
        flex: 1,
        alignItems: "center"
      }}
    className={"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center"}
    >
      <PortSearchForm />
    </SafeAreaView>
  );
}
