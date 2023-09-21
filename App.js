import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

// 모바일 폰의 크기를 가져옴
const windowWidth = Dimensions.get('window').width;
const API_KEY = "c406a836c908fbabe51c3a9c820d2872";

export default function App() {
  const [region, setRegion] = useState("Loading..."); // 현재 지역
  const [days, setDays] = useState([]);
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
      <View style={styles.city}>
        <Text style={styles.cityName}>{region}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}> 
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large"/>
          </View>
        ) 
        :  (
          days.map((day, index) => 
          <View key={index} style={styles.day}>
            <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.time}>{day.dt_txt}</Text>
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
  city: {
    flex: 1,
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
  day: {
    width: windowWidth,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
  },
  description: {
    marginTop: -30,
    fontSize: 50,
  },
  time: {
    fontSize: 20,
  }
})
