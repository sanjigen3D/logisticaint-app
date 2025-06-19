import { SafeAreaView } from "react-native";
import PortSearchForm from "@/components/forms/PortSearchForm";

export default function Index() {
  return (
    <SafeAreaView style={{
        flex: 1,
        alignItems: "center"
      }}>
      <PortSearchForm />
    </SafeAreaView>
  );
}
