import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, useTheme, Input, Button, Checkbox, Spinner } from 'tamagui';

import { AppleAuth } from '@/components/auth/appleAuth';
import GoogleAuth from '@/components/auth/googleAuth';
import { supabase } from '@/services/clients/supabase';
import useLoginStore from '@/store/loginStore';

const Page = () => {
  const { email, setEmail } = useLoginStore();
  const { password, setPassword } = useLoginStore();
  const { loading, setLoading } = useLoginStore();
  const { passwordIcon, setPasswordIcon } = useLoginStore();

  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const changePasswordIcon = () => {
    setPasswordIcon(!passwordIcon);
  };

  const onSignInPress = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
      <Text
        col={theme.secondaryColorTwo}
        fontSize="$5"
        fontWeight={500}
        lineHeight={16}
        fontStyle="normal"
        marginTop={45}
        alignSelf="center">
        Log in to Your Account
      </Text>
      <View marginTop={48} alignItems="flex-start">
        <Text
          col={theme.secondaryColorTwo}
          fontSize="$4"
          fontStyle="normal"
          fontWeight={400}
          lineHeight={16}>
          Email
        </Text>
        <View
          flexDirection="row"
          w="100%"
          h={44}
          flexShrink={0}
          br={5}
          borderWidth={0.5}
          borderColor="#D9D9D9"
          alignItems="center"
          pl={19}
          mt={6}>
          <Feather name="mail" size={20} color="#7F534B" />
          <Input
            placeholder="Sample@gmail.com"
            fontSize="$4"
            fontStyle="normal"
            fontWeight={400}
            letterSpacing={0.5}
            lineHeight={16}
            p={0}
            keyboardType="email-address"
            borderWidth={0}
            ml={18}
            value={email}
            onChangeText={setEmail}
            w="100%"
          />
        </View>
      </View>
      <View marginTop={24} alignItems="flex-start">
        <Text
          col={theme.secondaryColorTwo}
          fontSize="$4"
          fontStyle="normal"
          fontWeight={400}
          lineHeight={16}>
          Password
        </Text>
        <View
          flexDirection="row"
          w="100%"
          h={44}
          flexShrink={0}
          br={5}
          borderWidth={0.5}
          borderColor="#D9D9D9"
          alignItems="center"
          pl={19}
          mt={6}>
          <MaterialIcons name="password" size={20} color="#7F534B" />
          <Input
            placeholder="**************"
            fs={10}
            fontStyle="normal"
            fontWeight={400}
            letterSpacing={0.5}
            lineHeight={16}
            p={0}
            borderWidth={0}
            ml={18}
            secureTextEntry={passwordIcon}
            value={password}
            onChangeText={setPassword}
            w="100%"
          />
          <Button w={70} h="100%" onPress={changePasswordIcon}>
            {passwordIcon && <Feather name="eye" size={20} color="#7F534B" />}
            {!passwordIcon && <Feather name="eye-off" size={20} color="#7F534B" />}
          </Button>
        </View>
        <Text
          mt={13}
          alignSelf="flex-end"
          col={theme.secondaryColorTwo}
          fontSize={10}
          lineHeight={12}
          fontWeight={600}>
          Forgot Password?
        </Text>
        <View flexDirection="row" mt={10} alignItems="center">
          <Checkbox id="3" size="$5" borderColor={theme.primaryColor}>
            <Checkbox.Indicator>
              <Feather name="check" size={22} color="#8C705F" />
            </Checkbox.Indicator>
          </Checkbox>
          <Text ml={12} fontSize={12} fontWeight={400} lineHeight={16} col={theme.primaryColor}>
            Remember me
          </Text>
        </View>
        <Button
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          paddingVertical={10}
          bc={theme.primaryColor}
          mt={37}
          onPress={onSignInPress}>
          <Text color="#FFFFFF" fontSize={14} fontWeight={700} textAlign="center">
            LOGIN
          </Text>
        </Button>
        {loading && (
          <View
            flexDirection="row"
            alignSelf="center"
            mt="$2"
            alignItems="center"
            justifyContent="center">
            <Text fontWeight={600} color={theme.primaryColor}>
              Loading
            </Text>
            <Spinner size="small" ml="$2" color="#8C705F" />
          </View>
        )}
        <Text
          mt={43}
          color="#D2CDCA"
          fontSize={12}
          fontWeight={400}
          lineHeight={16}
          alignSelf="center">
          OR
        </Text>
        <Text
          mt={9}
          color="#D2CDCA"
          fontSize={12}
          fontWeight={400}
          lineHeight={16}
          alignSelf="center">
          Login with
        </Text>
        <View flexDirection="row" mt={28}>
          <AppleAuth />
          <GoogleAuth />
        </View>
      </View>
      <View w="100%" h={2} backgroundColor="#EDEDED" borderRadius={10} mt="$8" />
      <View mt="$9" flexDirection="row" alignSelf="center">
        <Text color="#D2CDCA" fontSize={14} fontWeight={500} lineHeight={16}>
          Don't have an account?{' '}
        </Text>
        <Link href="/signup">
          <Text color={theme.primaryColor} fontSize={14} fontWeight={700} lineHeight={16}>
            Sign up
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Page;
