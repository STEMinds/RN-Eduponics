import MQTT from 'sp-react-native-mqtt';
import _ from 'underscore';


module.exports = {  // cached singleton instance
  QOS: 1, // Only 0 and 1 supported by Rabbit
  props: null,
  randIdCreator() {
    // eslint-disable-next-line
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
  },
  create(userID, connectionProps = {}) {
    if (userID && connectionProps) {
      // http://www.hivemq.com/demos/websocket-client/
      this.onConnectionOpened = this.onConnectionOpened.bind(this);
      this.onConnectionClosed = this.onConnectionClosed.bind(this);
      this.onError = this.onError.bind(this);
      this.onMessageArrived = this.onMessageArrived.bind(this);
      this.disconnect = this.disconnect.bind(this);
      this.publish = this.publish.bind(this);

      const deviceId = this.randIdCreator()
        .replace(/[^a-zA-Z0-9]+/g, '');

      this.conProps = _.extend({
        clientId: `realtime.${userID}.${deviceId}`,
        channelToUse: `mqtt-subscription-realtime.${userID}`,
        auth: false,
        clean: true, // clean session YES deletes the queue when all clients disconnect
      }, connectionProps);

      /* create mqtt client */
      MQTT.createClient(this.conProps)
        .then((client) => {
          this.client = client;
          client.on('closed', this.onConnectionClosed);
          client.on('error', this.onError);
          client.on('message', this.onMessageArrived);
          client.on('connect', this.onConnectionOpened);
          client.connect();
          client.publish('test',test);
        }).catch((err) => {
          console.error(`MQTT.createtClient error: ${err}`);
        });
    }
  },

  publish(topic,message){
    this.client.publish(topic,message);
  },

  disconnect() {
    if (this.client) {
      console.log('Now killing open realtime connection.');
      this.client.disconnect();
    }
  },

  onError(error) {
    console.error(`MQTT onError: ${error}`);
  },

  onConnectionOpened() {
    // subscribe to the client channel
    this.client.subscribe(this.conProps.channelToUse, this.QOS);

    console.log('MQTT onConnectionOpened');
  },

  onConnectionClosed(err) {
    console.log(`MQTT onConnectionClosed ${err}`);
  },

  onMessageArrived(message) {
    if (message) {
      console.log(`MQTT New message: ${JSON.stringify(message)}`)
    }
  },


};
