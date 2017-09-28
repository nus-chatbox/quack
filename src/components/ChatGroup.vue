<template>
  <q-card>
    <q-card-main>
      <q-item multiline>
        <q-item-side>
          <q-item-tile avatar>
            <img src="../assets/logo.png" />
          </q-item-tile>
        </q-item-side>
        <q-item-main
         :label="name"
         label-lines="1"
         :sublabel="lastMessage"
         sublabel-lines="2"
        />
        <q-item-side right stamp="5 m<br>away" />
      </q-item>
    </q-card-main>
  </q-card>
</template>

<script>
import { Ripple, QBtn, QCard, QCardTitle, QCardMain, QItem, QItemSide, QItemMain, QItemTile } from 'quasar-framework';

export default {
  directives: {
    Ripple
  },
  components: {
    QBtn,
    QCard,
    QCardTitle,
    QCardMain,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile
  },
  props: ['id', 'name'],
  computed: {
    lastMessage() {
      const message = this.$store.getters.getLatestRoomMessage(this.id);
      return `${message.owner.displayName} : ${message.text}`;
    }
  }
};
</script>

<style>
</style>