import NodeGeocoder, { Providers, Options } from 'node-geocoder';
import geocoderConfig from '@config/geocoder';

const options: Options = {
  provider: geocoderConfig.provider as Providers,
  httpAdapter: 'https',
  apiKey: geocoderConfig.apiKey,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

export default geocoder;
