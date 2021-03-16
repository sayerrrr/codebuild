import Analytics from 'analytics-node'
import logger from '../../lib/logger'
import { PushMessage } from './types'
const cio = require('customerio-node')

export class PushService {
  segmentAnalytics: Analytics
  customerio: any

  constructor(
    private segmentWriteKey: string,
    private cioSiteID: string,
    private cioApiKey: string,
  ) {
    try {
      this.segmentAnalytics = new Analytics(this.segmentWriteKey, {
        flushInterval: 500,
      })
      this.customerio = new cio(this.cioSiteID, this.cioApiKey)
    } catch (e) {
      logger.error('Caught error instantiating push service', e)
    }
  }

  async sendPushMessage(message: PushMessage): Promise<void> {
    switch (message.type) {
      case 'CustomerIOBroadcast': {
        try {
          await this.customerio.triggerBroadcast(
            message.payload.id,
            message.payload.data,
            message.payload.recipients,
          )
        } catch (e) {
          logger.error('Error sending CIO broadcast', { message, e })
        }
        break
      }

      case 'SegmentTrack': {
        try {
          await new Promise((resolve) =>
            this.segmentAnalytics.track(message.payload, resolve),
          )
        } catch (e) {
          logger.error('Error sending Segment track', { e })
        }
        break
      }

      case 'SegmentIdentify': {
        try {
          await new Promise((resolve) =>
            this.segmentAnalytics.identify(message.payload, resolve),
          )
        } catch (e) {
          logger.error('Error sending Segment identify', { message, e })
        }
        break
      }
    }
  }
}
