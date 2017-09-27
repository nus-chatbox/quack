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
import { QModal, QInput, QField, QBtn, Alert } from 'quasar-framework';
import { required, maxLength } from 'vuelidate/lib/validators';
import 'quasar-extras/animate/fadeInDown.css';
import 'quasar-extras/animate/fadeOut.css';

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
        const alert = Alert.create({
          color: 'negative',
          icon: 'warning',
          html: 'Sorry! This is not a valid group name.',
          duration: 1000,
          enter: 'fadeInDown',
          leave: 'fadeOut',
          position: 'top-center',
          id: 'one',
          dismissible: true
        });
        setTimeout(() => {
          alert.dismiss();
        }, 2000);
      } else {
        fetch(`${window.apiUrl}/rooms`, {
          method: 'POST',
          headers: {
            Authorization: `bearer ${this.$store.state.user.jwtToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: {
            title: this.chatGroupName
          }
        })
        .then((response) => {
          this.$refs.modal.close();
          return response.json();
        })
        .catch((error) => {
          /* eslint-disable no-console */
          console.error(error);
          const alert = Alert.create({
            color: 'negative',
            icon: 'warning',
            html: 'Sorry! Something went wrong with creating the group.',
            duration: 1000,
            enter: 'fadeInDown',
            leave: 'fadeOut',
            position: 'top-center',
            id: 'one',
            dismissible: true
          });
          setTimeout(() => {
            alert.dismiss();
          }, 2000);
          return Promise.reject(error);
        });
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