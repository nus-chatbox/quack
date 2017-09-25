<template>
  <q-modal ref="modal" minimized>
    <div class="modal-content">
      <div class="modal-header">
        <h6>Create New Chat</h6>
      </div>
      <div class="modal-body">
        <q-field label="Chat Title"
          :error="!isValidGroupName"
          :error-label="validationMessage"
          :count="25"
          class="field-bottom-margin">
          <q-input v-model="chatGroupName" @blur="$v.chatGroupName.$touch" clearable/>
        </q-field>
        <q-btn color="primary" @click="createChatGroup()">Submit</q-btn>
      </div>
    </div>
  </q-modal>
</template>

<script>
import { QModal, QInput, QField, QBtn } from 'quasar-framework';
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
  components: {
    QModal,
    QInput,
    QField,
    QBtn
  },
  data() {
    return {
      chatGroupName: ''
    };
  },
  computed: {
    isValidGroupName() {
      return this.$v.chatGroupName.required && this.$v.chatGroupName.maxLength;
    },
    validationMessage() {
      if (!this.$v.chatGroupName.required) {
        return 'Required Field';
      } else if (!this.$v.chatGroupName.maxLength) {
        return 'Maximum of 25 Characters';
      }
      return '';
    }
  },
  validations: {
    chatGroupName: {
      required,
      maxLength: maxLength(25)
    }
  },
  methods: {
    createChatGroup() {
      if (!this.isValidGroupName) {
        //
      } else {
        this.$refs.modal.close();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '../style/app.variables'

.modal-header
  background-color: $primary
  color: white

.field-bottom-margin
  margin-bottom: 40px
</style>