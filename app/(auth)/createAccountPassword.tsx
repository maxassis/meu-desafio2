import { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  StatusBar
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation } from '@tanstack/react-query'; 
import { cva } from "class-variance-authority";
import Close from "../../assets/Close.svg";
import Logo from "../../assets/logo2.svg";
import CheckGreen from "../../assets/check-green.svg";

interface Criteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

export default function CreatePassword() {
  const { name, email } = useLocalSearchParams();  
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [criteria, setCriteria] = useState<Criteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (text: string): void => {
    const length = text.length >= 8;
    const uppercase = /[A-Z]/.test(text);
    const lowercase = /[a-z]/.test(text);
    const number = /[0-9]/.test(text);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(text);

    setCriteria({
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
    });

    setPassword(text);
  };

  const createUser = async (newPassword: string) => {
    const response = await fetch("http://172.22.0.1:3000/users", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name, email, password: newPassword }),
    });

    if (!response.ok) {
      if (response.statusText === "User already exists") {
        throw new Error("Usuário já existe");
      } else {
        throw new Error(response.statusText);
      }
    }

    return response.json();
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => createUser(password),
    onSuccess: () => {
      router.push("/createAccountDone");
    },
    onError: (error: Error) => {
      Alert.alert("Erro", error.message, [
        { text: "Ok", style: "cancel" },
      ]);
    }
  });

  const handleTextChange = (text: string) => {
    validatePassword(text);
  };

  const handleSubmit = () => {
    if (password !== password2) {
      Alert.alert("As senhas não coincidem", "", [{ text: "Ok", style: "cancel" }]);
      return;
    }
    mutate(); 
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      <ScrollView className="flex-1 bg-white" overScrollMode="never">
        <SafeAreaView className="flex-1 bg-white ">
          <View className="px-5 pt-[38px]">
            <View className="items-end mb-[10px]">
              <TouchableOpacity
                onPress={() => router.push("/intro")}
                className="h-[43px] w-[43px] rounded-full bg-bondis-text-gray justify-center items-center"
              >
                <Close />
              </TouchableOpacity>
            </View>

            <Logo />

            <Text className="font-inter-bold mt-4 text-2xl">Crie uma senha</Text>

            <Text className="font-inter-bold text-base mt-8">Senha</Text>
            <TextInput
              className="bg-bondis-text-gray rounded-[4px] h-[52px] mt-2 pl-4"
              onChangeText={handleTextChange}
              value={password}
              secureTextEntry
            />
            {password.length > 0 && (
              <Text
                className={PassStrong({
                  intent:
                    criteria.length &&
                    criteria.uppercase &&
                    criteria.lowercase &&
                    criteria.number &&
                    criteria.specialChar
                      ? null
                      : "error",
                })}
              >
                {criteria.length &&
                criteria.uppercase &&
                criteria.lowercase &&
                criteria.number &&
                criteria.specialChar
                  ? "Senha segura!"
                  : "Senha fraca!"}
              </Text>
            )}

            <View className="p-4 border-[1px] border-[#D9D9D9] mt-8 rounded-[4px]">
              <Text className="font-inter-bold text-sm mb-[10px]">
                Sua senha deve conter:
              </Text>
              {/* Critérios da senha */}
              <View className="flex-row items-center mb-2 gap-x-[9px]">
                {criteria.length ? <CheckGreen /> : <Close />}
                <Text
                  className={CriteriaStyles({
                    intent: criteria.length == false ? "error" : null,
                  })}
                >
                  Mínimo de 8 caracteres
                </Text>
              </View>
              <View className="flex-row items-center mb-2 gap-x-[9px]">
                {criteria.uppercase ? <CheckGreen /> : <Close />}
                <Text
                  className={CriteriaStyles({
                    intent: criteria.uppercase == false ? "error" : null,
                  })}
                >
                  1 letra maiúscula
                </Text>
              </View>
              <View className="flex-row items-center mb-2 gap-x-[9px]">
                {criteria.lowercase ? <CheckGreen /> : <Close />}
                <Text
                  className={CriteriaStyles({
                    intent: criteria.lowercase == false ? "error" : null,
                  })}
                >
                  1 letra minúscula
                </Text>
              </View>
              <View className="flex-row items-center mb-2 gap-x-[9px]">
                {criteria.number ? <CheckGreen /> : <Close />}
                <Text
                  className={CriteriaStyles({
                    intent: criteria.number == false ? "error" : null,
                  })}
                >
                  1 numeral
                </Text>
              </View>
              <View className="flex-row items-center gap-x-[9px]">
                {criteria.specialChar ? <CheckGreen /> : <Close />}
                <Text
                  className={CriteriaStyles({
                    intent: criteria.specialChar == false ? "error" : null,
                  })}
                >
                  1 caractere especial (!@#$%ˆ&*()
                </Text>
              </View>
            </View>

            {criteria.length &&
            criteria.uppercase &&
            criteria.lowercase &&
            criteria.number &&
            criteria.specialChar ? (
              <View className="mt-8">
                <Text className="font-inter-bold text-base">
                  Redigite sua senha
                </Text>
                <TextInput
                  className="bg-bondis-text-gray rounded-[4px] h-[52px] mt-2 pl-4"
                  onChangeText={(e) => setPassword2(e)}
                  value={password2}
                  secureTextEntry
                />
                <Text className="text-[#EB4335] font-inter-bold text-sm mt-2">
                  {password2 === password ? null : "As senhas devem ser iguais"}
                </Text>
              </View>
            ) : null}

            {/* Botão para criar a conta */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={password !== password2 || isPending}
              className={buttonDisabled({
                intent: password === password2 && !isPending ? null : "disabled",
              })}
            >
              <Text className="font-inter-bold text-base">
                {isPending ? "Criando conta..." : "Criar conta"}
              </Text>
            </TouchableOpacity>

            <Text className="text-center mt-8 mb-[42px]">
              Ao criar sua conta no Meu Desafio você concorda com os{" "}
              <Text className="font-inter-bold text-sm underline">
                Termos de serviço
              </Text>{" "}
              e{" "}
              <Text className="font-inter-bold text-sm underline">
                Política de Privacidade
              </Text>
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>
      <StatusBar backgroundColor="#000" barStyle="light-content" translucent={false} />
    </KeyboardAvoidingView>
  );
}

const CriteriaStyles = cva("text-sm text-[#34A853]", {
  variants: {
    intent: {
      error: "text-black",
    },
  },
});

const PassStrong = cva("mt-1 text-[#34A853] text-sm font-inter-bold", {
  variants: {
    intent: {
      error: "text-[#EB4335]",
    },
  },
});

const buttonDisabled = cva("h-[52px] flex-row bg-bondis-green mt-8 rounded-full justify-center items-center", {
  variants: {
    intent: {
      disabled: "opacity-50",
    },
  },
});
