import * as React from 'react';
import { AsyncStorage } from 'react-native';

export default function usePersistedState<T>(initialValue: T, key: string) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<T>(initialValue);

  React.useEffect(() => {
    let isCancelled = false;

    const restoreData = async () => {
      setIsLoading(true);

      try {
        const data = await AsyncStorage.getItem(key);

        if (isCancelled) {
          return;
        }

        if (data) {
          setData(JSON.parse(data));
        }
      } catch (e) {
        // Ignore
      }

      setIsLoading(false);
    };

    restoreData();

    return () => {
      isCancelled = true;
    };
  }, [key]);

  React.useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [isLoading, data, setData] as const;
}
