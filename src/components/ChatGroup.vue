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
         label="Brunch this weekend? Brunch this weekend? Brunch this weekend?"
         label-lines="1"
         sublabel="John Doe: Anyone wants to eat my favourite char kway teow with me on Sunday?"
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
  }
};
</script>

<style>
</style>