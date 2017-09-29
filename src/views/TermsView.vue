<template>
	<div>
    <q-layout class="static-bg fullscreen">
      <router-link to="/" class="fixed-bottom-right" style="margin-bottom:16px; margin-right:16px">
          <q-btn icon="arrow back" round big v-ripple color="primary">
          </q-btn>
      </router-link>
      <div class="layout-view layout-padding">
        <div class="text-center">
          <h4><strong>Terms of Service</strong></h4>
        </div>
        <div class="layout-padding" style="padding-top:0.2rem">
          <ol class="main-list" style="padding-right:40px">
            <li class="subtitle">Terms

              <span class="terms-body">
                <p>By accessing the website at <a href="https://www.quack.press">https://www.quack.press</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
              </span>
            </li>

            <li class="subtitle">Use License
              <span class="terms-body">
                  <span>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Quack's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>

                    <p style="padding:0">
                      <ol>
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>attempt to decompile or reverse engineer any software contained on Quack's website;</li>
                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                      </ol>
                    </p>
                  </span>
                  <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Quack at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
              </span>
            </li>

            <li class="subtitle">Disclaimer

              <span class="terms-body">
                <p>The materials on Quack's website are provided on an 'as is' basis. Quack makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                <p>Further, Quack does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
              </span>

            </li>

            <li class="subtitle">Limitations

              <span class="terms-body">
                <p>In no event shall Quack or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Quack's website, even if Quack or a Quack authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
              </span>

            </li>

            <li class="subtitle">Accuracy of materials

              <span class="terms-body">
                <p>The materials appearing on Quack website could include technical, typographical, or photographic errors. Quack does not warrant that any of the materials on its website are accurate, complete or current. Quack may make changes to the materials contained on its website at any time without notice. However Quack does not make any commitment to update the materials.</p>
              </span>

            </li>

            <li class="subtitle">Links

              <span class="terms-body">
                <p>Quack has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Quack of the site. Use of any such linked website is at the user's own risk.</p>
              </span>

            </li>

            <li class="subtitle">Modifications

              <span class="terms-body">
                <p>Quack may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
              </span>

            </li>

            <li class="subtitle">Governing Law
              <span class="terms-body">
                <p>These terms and conditions are governed by and construed in accordance with the laws of Singapore and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
              </span>
            </li>
          </ol>
        </div>
      </div>
    </q-layout>
	</div>
</template>

<script>
import { Ripple, QBtn, QLayout } from 'quasar-framework';

export default {
  directives: {
    Ripple
  },
  components: {
    QBtn,
    QLayout
  }
};
</script>

<style scoped lang="stylus">
.subtitle
  margin-top:25px
  margin-bottom:25px
  font-size:18px
  font-weight: bold

.static-bg
  background-image:url('/static/img/bg.png')
  background-size:cover

.fullscreen
  overflow auto
</style>