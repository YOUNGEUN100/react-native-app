# Weather App
리액트 네이티브로 만든 날씨앱
## 구현 과정
- 모바일 폰의 크기를 가져옴(Dimensions 컴포넌트)
- 위치 정보 동의를 받고(Location.requestForegroundPermissionAsnyc()), 사용자의 현재 위치를 가져와 위도, 경도 확인 (Location.getCurrentPositionAnsync())
- 위도, 경도로 사용자의 지역 확인 (Location.reverseGeocodeAsync())
- openweather 에서 api 로 날씨 데이터 받기
- 날짜 데이터가 없으면 로딩이 뜸 (ActivityIndicatior 컴포넌트)
- 날씨 데이터를 스크롤해서 확인하기 (ScrollView 컴포넌트)
## 화면
3시간 간격의 날씨 정보를 보여줌
https://github.com/YOUNGEUN100/weather-app/assets/121986519/940dfb58-d836-43bd-82e3-acb2581d9d3d

