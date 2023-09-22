import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

// 모바일 폰의 크기를 가져옴
const windowWidth = Dimensions.get('window').width;
const API_KEY = "c406a836c908fbabe51c3a9c820d2872";
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Atmosphere: "cloudy-gusts",
  Snow: "snowflake",
  Rain: "rain",
  Drizzle: "rains",
  Thunderstorm: "lighting",
}

export default function App() {
  const [region, setRegion] = useState("Loading..."); // 현재 지역
  const [days, setDays] = useState([]); // 날씨 데이터
  const [ok, setOk] = useState(true); // 위치 정보 제공 동의

  const getWeather = async () => {   
    const {granted} = await Location.requestForegroundPermissionsAsync(); // 위치 정보 권한 확인
    if (!granted) { // 권한이 없다면
      setOk(false); // ok 를 false 로
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5}); // 현재 위치에서 위도, 경도를 가져옴
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false}) // 위도, 경도로 지역 확인
    setRegion(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=10&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(json.list);
    setDays(json.list);
  }

  useEffect(()=>{   // 재로딩할때마다 실행
    getWeather();
  },[]);


  return (
    <View style={styles.container}>
      { ok ? (
        <View style={styles.city}>
        <Text style={styles.cityName}>{region}</Text>
      </View>
      ) : (
        <View style={styles.city}>
           <Text style={styles.noGranted}>위치 정보에 동의해주세요.</Text>
        </View>
      )}
      <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}> 
        {days.length === 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator color="white" size="large"/>
          </View>
        ) 
        :  (
          days.map((day, index) => 
          <View key={index} style={styles.day}>
            <Text style={styles.time}>{day.dt_txt}</Text>
            <View style={{
              flexDirection: "row", 
              alignItems: "center",
              width: "100%",
              }}>
              <Text style={styles.temp}>
                {parseFloat(day.main.temp).toFixed(1)}
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={50} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.detailInfo}>{day.weather[0].description}</Text>
          </View>
          )
        )}
      </ScrollView>
    </View>
  );



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "teal",
  },
  noGranted: {
    fontSize: 20,
  },
  city: {
    flex: 1,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 50,
    fontWeight: "500",
    color: "rgb(236, 240, 241)",
  },  
  weather: {
  },
  loading: {
    width: windowWidth,
    alignItems: "center",
  },
  day: {
    width: windowWidth,
    alignItems: "flex-start",
    marginLeft: 20,
  },
  time: {
    marginTop: 50,
    fontSize: 15,
    color: "rgb(236, 240, 241)",
  },
  temp: {
    fontSize: 80,
    color: "rgb(236, 240, 241)",
    marginRight: 15,
  },
  description: {
    marginTop: -15,
    fontSize: 20,
    color: "rgb(236, 240, 241)",
  },
  detailInfo: {
    fontSize: 15,
    color: "rgb(236, 240, 241)",
  },
  
})
