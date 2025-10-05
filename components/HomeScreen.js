import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  TextInput,
  Button,
  Title,
  Provider,
  ActivityIndicator,
} from "react-native-paper";
import axios from "axios";
import { URL } from "react-native-url-polyfill";

const HomeScreen = () => {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);
  const [error, setError] = useState("");

  const validateLink = (url) => {
    try {
      const parsedUrl = new URL(url);
      const supportedDomains = [
        "instagram.com",
        "youtube.com",
        "youtu.be",
        "twitter.com",
        "x.com",
        "facebook.com",
        "pinterest.com",
      ];
      return supportedDomains.some((domain) =>
        parsedUrl.hostname.includes(domain)
      );
    } catch {
      return false;
    }
  };

  const handleProcessLink = async () => {
    if (!validateLink(link)) {
      setError(
        "Invalid or unsupported URL. Please enter a valid social media link."
      );
      setVideoDetails(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Replace with real API endpoint (e.g., y2mate.is or similar)
      const response = await axios.post(
        "https://api.social-download-api.com/fetch",
        {
          url: link,
        }
      );

      // Mock response structure (adjust based on actual API)
      const mockResponse = {
        platform: getPlatform(link),
        formats: [
          { resolution: "1080p", size: "50MB", url: "video-url-1080p" },
          { resolution: "720p", size: "30MB", url: "video-url-720p" },
          { resolution: "MP3", size: "5MB", url: "audio-url" }, // MP3 option
        ],
      };

      setVideoDetails(mockResponse);
    } catch (err) {
      setError("Failed to fetch video details. Try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatform = (url) => {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("instagram.com")) return "Instagram";
    if (
      parsedUrl.hostname.includes("youtube.com") ||
      parsedUrl.hostname.includes("youtu.be")
    )
      return "YouTube";
    if (
      parsedUrl.hostname.includes("twitter.com") ||
      parsedUrl.hostname.includes("x.com")
    )
      return "Twitter/X";
    if (parsedUrl.hostname.includes("facebook.com")) return "Facebook";
    if (parsedUrl.hostname.includes("pinterest.com")) return "Pinterest";
    return "Unknown";
  };

  const renderFormat = ({ item }) => (
    <TouchableOpacity
      style={styles.formatButton}
      onPress={() => console.log(`Download: ${item.resolution}`)} // Placeholder for download
    >
      <Text style={styles.formatText}>
        {item.resolution} ({item.size})
      </Text>
    </TouchableOpacity>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <Title style={styles.title}>Social Video Downloader</Title>
        <TextInput
          label="Paste Video Link"
          value={link}
          onChangeText={setLink}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#6200ea" } }}
          error={!!error}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleProcessLink}
          style={styles.button}
          contentStyle={styles.buttonContent}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Process Link"}
        </Button>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#6200ea"
            style={styles.loader}
          />
        )}
        {videoDetails && (
          <View style={styles.results}>
            <Text style={styles.platform}>
              Platform: {videoDetails.platform}
            </Text>
            <FlatList
              data={videoDetails.formats}
              renderItem={renderFormat}
              keyExtractor={(item) => item.resolution}
              style={styles.formatList}
            />
          </View>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#6200ea",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  error: {
    color: "#d32f2f",
    marginBottom: 16,
    textAlign: "center",
  },
  loader: {
    marginTop: 16,
  },
  results: {
    marginTop: 24,
  },
  platform: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  formatList: {
    maxHeight: 200,
  },
  formatButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  formatText: {
    fontSize: 16,
    color: "#6200ea",
  },
});

export default HomeScreen;
