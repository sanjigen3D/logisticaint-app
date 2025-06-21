import { SafeAreaView } from "react-native";
import PortSearchForm from "@/components/forms/PortSearchForm";

export default function Index() {
  return (
    <SafeAreaView style={{
        flex: 1,
        alignItems: "center"
      }}
    className={"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-10 flex items-center px-2 md:px-0"}
    >
      <PortSearchForm />
    </SafeAreaView>
  );
}
